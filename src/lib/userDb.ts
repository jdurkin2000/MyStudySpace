type User = {
  email: string;
  password: string;
};

export async function addUserDb({ email, password }: User) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!response.ok) throw new Error("Error trying to add widget");
}
