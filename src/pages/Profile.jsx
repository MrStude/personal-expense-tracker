import { Navbar } from "../components/Navbar.jsx";
import { UserProfile } from "../components/UserProfile.jsx";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 ">User Profile</h1>
        <UserProfile />
      </main>
    </div>
  );
}
