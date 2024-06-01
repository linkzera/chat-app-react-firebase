import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FileImage } from "phosphor-react";
import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const metadata: any = {
        contentType: "image/jpeg",
      };

      const storageRef = ref(storage, "images/" + displayName);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErr(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(userCredential.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", userCredential.user.uid), {
              uid: userCredential.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", userCredential.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (err: any) {
      setErr((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center bg-blue-300 min-h-screen">
      <div className="px-10 py-5 bg-white rounded-lg flex flex-col gap-2 items-center md:min-w-[400px]">
        <span className="font-bold text-2xl text-sky-600">Chat App</span>
        <span className="text-xs text-sky-600 ">Register</span>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            placeholder="display name"
            className="p-4 border-b-2 border-blue-300 placeholder:text-zinc-400"
          />
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
          <input
            type="file"
            name="file"
            id="file"
            className="p-4 border-b-2 border-blue-300 hidden"
          />
          <label
            htmlFor="file"
            className="flex items-center gap-2 text-blue-400 cursor-pointer"
          >
            <FileImage size={32} />
            <span className="text-xs"> Add an avatar</span>
          </label>
          <button
            type="submit"
            className="p-3 bg-blue-300 text-white font-bold rounded-lg cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
          {err && <span>Something went wrong</span>}
        </form>
        <span className="text-blue-500 text-xs mt-3">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};
