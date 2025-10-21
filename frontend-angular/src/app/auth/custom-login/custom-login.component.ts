import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-login',
  templateUrl: './custom-login.component.html',
  styleUrls: ['./custom-login.component.scss'],
})
export class CustomLoginComponent implements OnInit, OnDestroy {
  private listenerRemovers: Array<() => void> = [];

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Attach click handlers for togglers
    const el = this.host.nativeElement as HTMLElement;
    const togglers = el.querySelectorAll<HTMLElement>('.lnk-toggler');
    togglers.forEach((t) => {
      const fn = () => {
        const panel = t.getAttribute('data-panel');
        if (panel) {
          this.showPanel(panel);
        }
      };
      t.addEventListener('click', fn);
      this.listenerRemovers.push(() => t.removeEventListener('click', fn));
    });

    // password toggle
    const pwdToggles = el.querySelectorAll<HTMLElement>('.pwd-toggle');
    pwdToggles.forEach((t) => {
      const fn = () => {
        const input = t.parentElement?.querySelector<HTMLInputElement>('input[type="password"], input[type="text"]');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          t.classList.remove('fa-eye-slash');
          t.classList.add('fa-eye');
        } else {
          input.type = 'password';
          t.classList.remove('fa-eye');
          t.classList.add('fa-eye-slash');
        }
      };
      t.addEventListener('click', fn);
      this.listenerRemovers.push(() => t.removeEventListener('click', fn));
    });

    // simple link buttons (social) prevent default navigation
    const social = el.querySelectorAll<HTMLElement>('.social-buttons a');
    social.forEach((s) => {
      const fn = (ev: Event) => ev.preventDefault();
      s.addEventListener('click', fn);
      this.listenerRemovers.push(() => s.removeEventListener('click', fn));
    });
  }

  ngOnDestroy(): void {
    this.listenerRemovers.forEach((r) => r());
    this.listenerRemovers = [];
  }

  showPanel(selector: string) {
    const host = this.host.nativeElement as HTMLElement;
    const panels = host.querySelectorAll<HTMLElement>('.authfy-panel');
    panels.forEach((p) => p.classList.remove('active'));
    const target = host.querySelector<HTMLElement>(selector);
    if (target) target.classList.add('active');
  }

  onSubmitLogin(ev: Event) {
    ev.preventDefault();
    // TODO: integrate with backend auth API
    const host = this.host.nativeElement as HTMLElement;
    const email = host.querySelector<HTMLInputElement>('input[name="username"]')?.value;
    const password = host.querySelector<HTMLInputElement>('input[name="password"]')?.value;
    console.log('login submit', { email, password });
    // show a temporary feedback or call a service
  }
}
