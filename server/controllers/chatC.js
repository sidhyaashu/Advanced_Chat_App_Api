import User from "../models/userM.js";
import Chat from "../models/chatM.js";
import mongoose from "mongoose";

/**Find and createing one one chat */
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId is not send to the request");
    res.status(400).send({ message: "No user Found" });
  }
  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: createChat._id,
      }).populate("users", "-password");
      res.status(200).send(fullChat);
    }
  } catch (error) {
    res.status(400).send({ message: "Problem to create chat upper", error });
  }
};

/** Fetch owner involving chat */
const fetchChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email",
        });

        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send({ message: "Problem in fetching chat message" });
  }
};

/** Creating Group chat */
const createGroup = async (req, res) => {
  if (!req.body.users || !req.body.chatName) {
    res.status(400).send({ message: "Please provide users and chat name" });
  } else {
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
      res.status(400).send({ message: "Please provide atleast 2 users" });
    } else {
      users.push(req.user);
      try {
        const groupChat = await Chat.create({
          chatName: req.body.chatName,
          isGroupChat: true,
          users: users,
          groupAdmin: req.user,
        });

        const fullGroup = await Chat.find({
          _id: groupChat._id,
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        res.status(200).send(fullGroup);
      } catch (error) {
        res.status(500).send({ message: "Problem to create group chat" });
      }
    }
  }
};

/**Rename the group by admin */
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    res.status(400).send({ message: "Please provide chat id and chat name" });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(400).send({ message: "Problem to rename group" });
    } else {
      res.status(200).send(updatedChat);
    }
  } catch (error) {
    res.status(500).send({ message: "Server Problem to rename group" });
  }
};

/**Add member in group */
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    res.status(400).send({ message: "Please provide chat id and user id" });
  } else {
    try {
      const added = await Chat.findByIdAndUpdate(
        { _id: chatId },
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!added) {
        res.status(400).send({ message: "Problem to add user to group" });
      } else {
        res.status(200).send(added);
      }
    } catch (e) {
      res.status(500).send({ message: "Server Problem to add user to group" });
    }
  }
};

/** Remove member from this group */
const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      res.status(400).send({ message: "Please provide chat id and user id" });
    } else {
      try {
        const remove = await Chat.findByIdAndUpdate(
          { _id: chatId },
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if (!remove) {
          res.status(400).send({ message: "Problem to remove user to group" });
        } else {
          res.status(200).send(remove);
        }
      } catch (e) {
        res
          .status(500)
          .send({ message: "Server Problem to remove user to group" });
      }
    }
};

export default {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
