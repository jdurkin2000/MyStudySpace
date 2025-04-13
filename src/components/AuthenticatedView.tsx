import React, { useState } from 'react';
import styles from '@/styles/AuthenticatedView.module.css';

interface Item {
  id: number;
  title: string;
  description: string;
}

const AuthenticatedView: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemTitle.trim() && newItemDescription.trim()) {
      const newItem: Item = {
        id: Date.now(),
        title: newItemTitle,
        description: newItemDescription,
      };
      setItems([...items, newItem]);
      setNewItemTitle('');
      setNewItemDescription('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <h2>Please log in to view your items</h2>
        <button onClick={handleLogin} className={styles.authButton}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Items</h2>
        <button onClick={handleLogout} className={styles.authButton}>
          Logout
        </button>
      </div>

      <form onSubmit={handleAddItem} className={styles.form}>
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Item title"
          className={styles.input}
          required
        />
        <textarea
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
          placeholder="Item description"
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.addButton}>
          Add New Item
        </button>
      </form>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthenticatedView; 