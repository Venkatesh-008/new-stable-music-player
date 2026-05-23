import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { storage }
from '../store/mmkv';

const QueueHistoryContext =
  createContext();

export const QueueHistoryProvider =
({ children }) => {

  const [queues, setQueues] =
    useState([]);

  const hasLoadedQueues =
    useRef(false);

  useEffect(() => {

    const savedQueues =
      storage.getString(
        'queueHistory'
      );

    if (savedQueues) {

      const parsed =
        JSON.parse(savedQueues);

      setQueues(parsed);

    }

    hasLoadedQueues.current =
      true;

  }, []);

  useEffect(() => {

    if (!hasLoadedQueues.current) {
      return;
    }

    storage.set(
      'queueHistory',
      JSON.stringify(queues)
    );

  }, [queues]);

  const saveQueue =
  (title, songs) => {

    if (!songs?.length) {
      return;
    }

    setQueues(prev => {

      const existingIndex =
        prev.findIndex(
          item =>
            item.title === title
        );

      const updatedQueue = {

        id:
          existingIndex >= 0
            ? prev[existingIndex].id
            : Date.now().toString(),

        title,

        songs,

        createdAt:
          Date.now(),

      };

      // UPDATE EXISTING
      if (existingIndex >= 0) {

        const updated =
          [...prev];

        updated[existingIndex] =
          updatedQueue;

        return updated;
      }

      // CREATE NEW
      return [
        updatedQueue,
        ...prev,
      ];

    });

  };

  const deleteQueue =
  (id) => {

    setQueues(prev =>
      prev.filter(
        item => item.id !== id
      )
    );

  };

  return (

    <QueueHistoryContext.Provider

      value={{
        queues,
        saveQueue,
        deleteQueue,
      }}
    >

      {children}

    </QueueHistoryContext.Provider>

  );

};

export const useQueueHistory =
() =>
  useContext(
    QueueHistoryContext
  );