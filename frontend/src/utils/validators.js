export const validateEmployee = (employee) => {
  const errors = {};

  if (!employee.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!employee.department.trim()) {
    errors.department = 'Department is required';
  }

  if (!employee.salary || employee.salary <= 0) {
    errors.salary = 'Valid salary is required';
  }

  if (!employee.plan.trim()) {
    errors.plan = 'Benefit plan is required';
  }

  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};