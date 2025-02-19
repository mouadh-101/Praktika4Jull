export enum Role  {
    STUDENT = 'Student',
    COMPANY = 'Company'
}
  
  export class User {
    userId?: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: Role;
  
    constructor(name: string, email: string, password: string, phone: string, address: string, role: Role) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.phone = phone;
      this.address = address;
      this.role = role;
    }
  }