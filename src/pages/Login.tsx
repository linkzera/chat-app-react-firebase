import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

export const Login = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser }: any = useContext(AuthContext);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      await setCurrentUser(user?.user);
      navigate("/");
    } catch (err: any) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center bg-blue-300 min-h-screen">
      <div className="px-10 py-5 bg-white rounded-lg flex flex-col gap-2 items-center md:min-w-[400px]">
        <span className="font-bold text-2xl text-sky-600">Chat App</span>
        <span className="text-xs text-sky-600 ">Login</span>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="email"
            className="p-4  border-b-2 border-blue-300"
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="p-4  border-b-2 border-blue-300"
          />

          <button
            type="submit"
            className="p-3 bg-blue-300 text-white font-bold rounded-lg cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          {err && (
            <span className="self-center text-rose-500 font-bold">
              Something went wrong, try again
            </span>
          )}
        </form>
        <span className="text-blue-500 text-xs mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
};
