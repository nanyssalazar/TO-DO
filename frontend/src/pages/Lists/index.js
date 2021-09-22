import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Form from "../../components/Form";
import ListItem from "../../components/ListItem";
import api from "../../services/api";
import "./Lists.scss";

const Lists = () => {
  const [formIsShown, setFormIsShown] = useState(false);
  // creo que no ocupamos este estado
  const [lists, setLists] = useState([]);
  const [sortedLists, setSortedLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading);

  const showFormHandler = () => {
    setFormIsShown(true);
    console.log("HERE");
  };

  const hideFormHandler = () => {
    setFormIsShown(false);
  };

  const submitList = async (e, title, colorValue) => {
    e.preventDefault();
    // Recolectando info del autor
    const author = localStorage.getItem("_id");
    console.log(title, author, colorValue);
    const response = await api.post("/lists/", {
      title: title,
      author: author,
      colorValue: colorValue,
    });
    console.log(response);
    window.location.reload();
  };

  const fetchLists = async () => {
    const author = localStorage.getItem("_id");
    console.log("RUTA", `/lists/${author}`);
    const response = await api.get(`/lists/${author}`);
    const listsFetched = response.data;
    console.log("fetched", listsFetched);
    setLists(listsFetched);
    listsFetched.map((item) => {
      item.lastEdited = new Date(item.lastEdited);
    });
    setSortedLists(
      listsFetched.sort(
        (a, b) => b.lastEdited.valueOf() - a.lastEdited.valueOf()
      )
    );
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLists();
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      <Sidebar onAdd={showFormHandler} title="My lists" returnButton={false} />
      {formIsShown && (
        <Form mode="List" onSubmit={submitList} onClose={hideFormHandler} />
      )}
      {isLoading ? (
        <p>Loading...</p>
      ) : sortedLists.length > 0 ? (
        <div className="lists-container">
          {sortedLists.map((list) => (
            <ListItem key={list._id} {...list} />
          ))}
        </div>
      ) : (
        <>
          <div className="no-lists">
            <p>You don't have any lists yet</p>
            <img src="https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif?cid=ecf05e475guek39srikhna896xhu67fmy2jccyf82nztpmba&rid=giphy.gif&ct=g" />
          </div>
        </>
      )}
    </div>
  );
};

export default Lists;
