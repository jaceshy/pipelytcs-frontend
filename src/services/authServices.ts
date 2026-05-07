export interface AuthPayload {
  fullName?: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const users: AuthPayload[] = [];

export const register = async (data: AuthPayload) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (!data.email.includes("@")) return reject(new Error("Invalid email"));
      if (users.find(u => u.email === data.email)) return reject(new Error("Email already exists"));

      users.push(data);
      resolve("ok");
    }, 500);
  });
};

export const login = async (data: LoginPayload) => {
  return new Promise<AuthPayload>((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === data.email && u.password === data.password);
      if (!user) return reject(new Error("Invalid credentials"));
      resolve(user);
    }, 500);
  });
};