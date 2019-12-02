class AppError<T> {
  private errors: Partial<Record<keyof T, string[]>> = {};
  public message: string = '';

  constructor(e) {
    if (e) {
      this.setErrors(e);
    }
  }

  addError = (key: keyof T, value: string) => {
    const array = this.errors[key] ? this.errors[key] : [];
    array!.push(value); // ! tells typescript value isn't undefined
    this.errors[key] = array;
  };

  getError = (key: keyof T): string => {
    return this.errors[key] ? this.errors[key]!.join('\n') : '';
  };

  resetError = (key: keyof T) => {
    this.errors[key] = [];
  };

  setError = (key: keyof T, value: string) => {
    this.resetError(key);
    this.addError(key, value);
  };

  setErrorIf = (invalid: boolean, key: keyof T, value: string) => {
    if (invalid) {
      this.setError(key, value);
    } else {
      this.resetError(key);
    }
  };

  setErrors = e => {
    if (e) {
      this.errors = e.errors ? e.errors : {};
      this.message = e.message ? e.message : '';
    }
  };

  reset = () => {
    this.errors = {};
    this.message = '';
  };
}

export default AppError;
