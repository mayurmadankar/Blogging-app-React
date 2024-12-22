import { useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import { db } from "../firebaseinit";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";

// Reducer function to manage blogs state
function blogsReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.blog, ...state];
    case "REMOVE":
      return state.filter((blog, index) => index !== action.index);
    case "SET_BLOGS":
      return action.blogs;
    default:
      return state;
  }
}

// Blogging App using Hooks
export default function Blog() {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [blogs, dispatch] = useReducer(blogsReducer, []);
  const titleRef = useRef(null);

  // Focus the title input on initial load
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  // Update the document title based on the first blog title
  useEffect(() => {
    if (blogs.length && blogs[0].title) {
      document.title = blogs[0].title;
    } else {
      document.title = "No blogs!";
    }
  }, [blogs]);

  // Fetch blogs from Firestore on component mount
  useEffect(() => {
    // async function fetchData() {
    //   const snapShot = await getDocs(collection(db, "blogs"));
    //   const blogsFromDb = snapShot.docs.map((doc) => {
    //     return {
    //       id: doc.id,
    //       ...doc.data()
    //     };
    //   });
    //   dispatch({ type: "SET_BLOGS", blogs: blogsFromDb }); // Update blogs state
    // }
    // fetchData();

    const unsub = onSnapshot(collection(db, "blogs"), (snapShot) => {
      const blogsFromDb = snapShot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      dispatch({ type: "SET_BLOGS", blogs: blogsFromDb }); // Update blogs state
    });
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    dispatch({
      type: "ADD",
      blog: { title: formData.title, content: formData.content }
    });

    const docRef = doc(collection(db, "blogs"));

    await setDoc(docRef, {
      title: formData.title,
      content: formData.content,
      createdOn: new Date()
    });

    setFormData({ title: "", content: "" });
    titleRef.current.focus();
  }

  // Remove a blog from the state
  async function removeBlog(i) {
    const docRef = doc(db, "blogs", i);
    await deleteDoc(docRef);
    dispatch({ type: "REMOVE", index: i });
  }

  return (
    <>
      {/* Heading of the page */}
      <h1>Write a Blog!</h1>

      {/* Division created to provide styling of section to the form */}
      <div className="section">
        {/* Form for writing the blog */}
        <form onSubmit={handleSubmit}>
          {/* Row component to create a row for the first input field */}
          <Row label="Title">
            <input
              className="input"
              placeholder="Enter the Title of the Blog here.."
              value={formData.title}
              ref={titleRef}
              onChange={(e) =>
                setFormData({
                  title: e.target.value,
                  content: formData.content
                })
              }
            />
          </Row>

          {/* Row component to create a row for Text area field */}
          <Row label="Content">
            <textarea
              className="input content"
              placeholder="Content of the Blog goes here.."
              value={formData.content}
              required
              onChange={(e) =>
                setFormData({ title: formData.title, content: e.target.value })
              }
            />
          </Row>

          {/* Button to submit the blog */}
          <button type="submit" className="btn">
            ADD
          </button>
        </form>
      </div>
      <hr />

      {/* Section where submitted blogs will be displayed */}
      <h2>Blogs</h2>
      <div>
        {blogs.map((blog, index) => (
          <div className="blog" key={index}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>

            <div className="blog-btn">
              <button
                onClick={() => removeBlog(blog.id)}
                className="btn remove"
              >
                Delete
              </button>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

// Row component to introduce a new row section in the form
function Row(props) {
  const { label } = props;
  return (
    <>
      <label>
        {label}
        <br />
      </label>
      {props.children}
      <hr />
    </>
  );
}
