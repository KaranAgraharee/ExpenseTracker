import { Contact } from "../model/Contact.js";

export const getContact = async (req, res) => {
  try {
    const userContact = req.user._id;
    const contacts = await Contact.find({ Users: { $in: [userContact] } }).populate('Users', 'name email')
    res.status(200).json({
      message: "Contact Fetched successfully",
      success: true,
      Contact: contacts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
export const CreateaContacts = async (req, res) => {
  try {
    const Members = req.createdGroup.members
    const user = req.user._id

    const person = Members.filter((p)=> p._id !== user) 

    const contactsToInsert = person.map((memberId) => ({
      Users: [user, memberId],
    }));

    const existingContacts = await Contact.find({
      Users: { $all: [user] },
    });

    const existingPairs = existingContacts.map((c) =>
      c.Users.map((id) => id.toString()).sort().join("-")
    );

    const newContacts = contactsToInsert.filter((contact) => {
      const pairKey = contact.Users.map((id) => id.toString()).sort().join("-");
      return !existingPairs.includes(pairKey);
    });

    if (newContacts.length > 0) {
      await Contact.insertMany(newContacts);
    }
    res.status(201).json({
      message: 'Group and contacts created successfully',
      success: true,
      Group: req.createdGroup,
      contactsCreated: newContacts.length
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }  
}
export const createNonGroupContact = async (req, res) => {
  try {
    const {Person} = req.body
    const User = req.user._id
    const newcontact = [Person, User]
    Contact.save(newcontact)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}