import { useRef, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Python",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },

  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriendForm((form) => !form);
  }

  function handleAddNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);

    setShowAddFriendForm(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curSelected) =>
      curSelected?.id === friend.id ? null : friend
    );

    setShowAddFriendForm(false);
  }

  function handleSplitBill(val) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriendForm && (
          <FormAddFriend onAddNewFriend={handleAddNewFriend} />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          onSplitBill={handleSplitBill}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="friend" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const friend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    console.log(friend);
    onAddNewFriend(friend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend">
      <label>🧑‍🤝‍🧑 Friends name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷 Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button onClick={handleSubmit}>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendsBill = bill ? bill - myExpense : "";
  const [payBill, setpayBill] = useState("user");

  function handlleSubmit(e) {
    e.preventDefault();

    onSplitBill(payBill === "user" ? friendsBill : -myExpense);
  }

  return (
    <form onSubmit={handlleSubmit} className="form-split-bill">
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
      />

      <label>👤 Your expense</label>
      <input
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
        type="text"
      />

      <label>👥{selectedFriend.name}'s expense</label>
      <input value={friendsBill} type="text" disabled />

      <label>Who's going to pay</label>
      <select value={payBill} onChange={(e) => setpayBill(e.target.value)}>
        <option value="user">Me</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button type="submit">Split bill</Button>
    </form>
  );
}

export default App;
