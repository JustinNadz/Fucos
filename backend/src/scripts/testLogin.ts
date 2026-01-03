async function main() {
  const res = await fetch("http://localhost:3001/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "ahmadmustafa.dev@gmail.com",
      password: "AM#Pro9922",
    }),
  });

  try {
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Non-JSON response, status:", res.status);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
