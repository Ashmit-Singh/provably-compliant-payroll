param(
  [string]$SourcePath = "C:\ngx-admin-master",
  [string]$TargetDir = "frontend-angular",
  [switch]$Force
)

# Resolve workspace root (this script is in <workspace>/tools)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkspaceRoot = Split-Path -Parent $ScriptDir
$TargetPath = Join-Path -Path $WorkspaceRoot -ChildPath $TargetDir

Write-Host "[CompliantAI] Importing ngx-admin from: $SourcePath" -ForegroundColor Cyan
if (-not (Test-Path $SourcePath)) {
  Write-Error "Source path not found: $SourcePath"
  exit 1
}

if (Test-Path $TargetPath) {
  if ($Force) {
    Write-Host "[CompliantAI] Removing existing target: $TargetPath" -ForegroundColor Yellow
    Remove-Item -Recurse -Force $TargetPath
  } else {
    Write-Error "Target path already exists: $TargetPath. Use -Force to replace."
    exit 1
  }
}

Write-Host "[CompliantAI] Copying files to: $TargetPath" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $TargetPath | Out-Null
Copy-Item -Path (Join-Path $SourcePath '*') -Destination $TargetPath -Recurse -Force

# Remove potential VCS directories
@('.git', '.github') | ForEach-Object {
  $p = Join-Path $TargetPath $_
  if (Test-Path $p) { Remove-Item -Recurse -Force $p }
}

# Rebrand in package.json
$PkgJsonPath = Join-Path $TargetPath 'package.json'
if (Test-Path $PkgJsonPath) {
  try {
    $pkg = Get-Content $PkgJsonPath -Raw | ConvertFrom-Json
    $pkg.name = 'compliantai'
    $pkg.description = 'CompliantAI Admin Dashboard (based on ngx-admin)'
    $pkg | ConvertTo-Json -Depth 100 | Set-Content -Encoding UTF8 $PkgJsonPath
    Write-Host "[CompliantAI] Updated package.json name/description." -ForegroundColor Green
  } catch {
    Write-Warning "[CompliantAI] Failed structured update to package.json. Falling back to text replace."
    (Get-Content $PkgJsonPath -Raw) -replace 'ngx-admin', 'compliantai' | Set-Content -Encoding UTF8 $PkgJsonPath
  }
}

# Replace branding across common file types
$patterns = @('*.ts','*.html','*.scss','*.md','*.json')
$files = Get-ChildItem -Path $TargetPath -Recurse -File -Include $patterns -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\node_modules\\' }
foreach ($file in $files) {
  try {
    $content = Get-Content $file.FullName -Raw
    $updated = $content -replace '(?i)ngx-admin', 'CompliantAI'
    if ($updated -ne $content) {
      Set-Content -Path $file.FullName -Value $updated -Encoding UTF8
    }
  } catch {
    Write-Warning "[CompliantAI] Failed to update: $($file.FullName)"
  }
}

# Make sure index.html title reflects new brand
$IndexHtml = Join-Path $TargetPath 'src/index.html'
if (Test-Path $IndexHtml) {
  (Get-Content $IndexHtml -Raw) -replace '(?is)(<title>)(.*?)(</title>)', '$1CompliantAI$3' | Set-Content -Encoding UTF8 $IndexHtml
}

Write-Host "[CompliantAI] Import complete." -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1) cd $TargetDir" -ForegroundColor Yellow
Write-Host "  2) npm install" -ForegroundColor Yellow
Write-Host "  3) npm start (or ng serve)" -ForegroundColor Yellow
