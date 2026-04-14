import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <h2>My Website</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
    </nav>
  );
}