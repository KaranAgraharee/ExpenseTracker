import { Contact } from "../model/Contact.js";
import { groupModel } from "../model/group.js"
import { UserModel } from "../model/User.js"

export const CreatGroup = async (req, res, next) => {
    try {
        const {name, members} = req.body
        const user = req.user._id
        if (!name) {
            return res.status(400).json({
                message: 'Group name is required',
                success: false
            });
        }
        
        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({
                message: 'At least one member is required',
                success: false
            });
        }
        
        const Group = new groupModel({GroupName: name, members})
        await Group.save()
        // Store group data for the next middleware
        req.createdGroup = Group;
        next()
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({
            message: error.message || 'Internal server error while creating group',
            success: false
        })
    }
}
export const AddMember = async (req, res) => {
    try {
        const { query } = req.query
        
        if (!query || query.length < 2) {
            return res.status(400).json({
                message: 'Query must be at least 2 characters long',
                success: false
            });
        }

        const suggestions = await UserModel.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ]
        }).select("name email");

        res.status(200).json(suggestions);
        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: error.message
        });
    }
} 

export const GetGroup = async (req, res) => {
    try {
        const _id = req.user._id
        const Group = await groupModel.find({ members: {$in:[_id]}}).populate('members')
        res.status(200).json({
            message: 'Group fetched successfully',
            success: true,
            Group
        })
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({
            message: error.message || 'Internal server error while fetching group',
            success: false
        })
    }
}
export const leaveGroup = async (req, res) => {
    try { 
        const user = req.user._id
        const { groupId } = req.body
        
        if (!groupId) {
            return res.status(400).json({
                message: 'Group ID is required',
                success: false
            });
        }
        
        const group = await groupModel.findByIdAndUpdate(
            groupId,
            {$pull:{members: user}},
            {new: true}
        );
        
        if (!group) {
            return res.status(404).json({
                message: 'Group not found',
                success: false
            });
        }
        
        res.status(200).json({
            message: 'You have been removed from the group',
            success: true,
            group
        })
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({
            message: error.message || 'Internal server error while leaving group',
            success: false
        })
    }
}
// export const currentGroup = asyn (req, res) => {
//     try {
//         const {grp_id}
//     } catch (error) {
        
//     }
// }
export const UpdateGroup = async (req, res) => {
    try { 
        const { groupId, name } = req.body
        if (!groupId || !name) {
            return res.status(400).json({
                message: 'Group ID and name are required',
                success: false
            });
        }
        
        const group = await groupModel.findByIdAndUpdate(
            groupId,
            { GroupName: name },
            { new: true }
        )
        
        if (!group) {
            return res.status(404).json({
                message: 'Group not found',
                success: false
            });
        }
        
        res.status(200).json({
            message: 'Group modified successfully',
            success: true,
            group
        })
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({
            message: error.message || 'Internal server error while updating group',
            success: false
        })
    }
}