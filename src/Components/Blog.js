import { useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import { db } from "../firebaseinit";

function blogsReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.blog, ...state];
    case "REMOVE":
      return state.filter((blog, index) => index !== action.index);
    default:
      return [];
  }
}

// Blogging App using Hooks
export default function Blog() {
  //   const [title, setTitle] = useState(""); // Initialize with an empty string
  //   const [content, setContent] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "" }); //variable which hold object
  // const [blogs, setBlogs] = useState([]);
  const [blogs, dispatch] = useReducer(blogsReducer, []);

  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (blogs.length && blogs[0].title) {
      document.title = blogs[0].title;
    } else {
      document.title = "No blogs!";
    }
  }, [blogs]);

  // Prevent page refresh on form submit
  function handleSubmit(e) {
    e.preventDefault();
    // setBlogs([{ title: formData.title, content: formData.content }, ...blogs]);
    dispatch({
      type: "ADD",
      blog: { title: formData.title, content: formData.content }
    });
    setFormData({ title: "", content: "" });
    titleRef.current.focus();
  }
  function removeBlog(i) {
    // setBlogs(blogs.filter((blog, i) => index !== i));
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
              <button onClick={() => removeBlog(index)} className="btn remove">
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