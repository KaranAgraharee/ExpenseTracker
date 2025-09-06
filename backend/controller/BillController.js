import Bill from "../model/bill.js";

export const creatBill =async (req, res, next) => {
    try {
        const user = req.user._id
        const {Description, Price, Date, Notes="",Paid} = req.body
        const bill = new Bill({
            User: user,
            Description,
            Price,
            Date,
            Paid,
            Notes
        })
        await bill.save()
        res.status(200).json({
            message: "Bill Created",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Error in creating bill",
            success: false,
            Error: error
        })
    }
}
export const UpdateBill =async (req, res, next) => {
    try {
        const user = req.user._id
        const {_id, Description, Price, Date, Notes, Paid} = req.body
        const bill = await Bill.findOneAndUpdate(
            {_id: _id, User: user},
            {Description, Price, Date, Notes, Paid},
            {new: true}
        )
        if(bill){
            res.status(200).json({
                message: "Bill Updated",
                success: true
            })
        }else{
            res.status(404).json({
                message: "Bill not found or unauthorized",
                success: false
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error in updating bill",
            success: false,
            Error: error
        })
    }
}
export const getBill = async (req,res,next) => {
    try {
        const user = req.user._id
        const bills = await Bill.find({User: user})

        res.status(200).json({
            message: "Bill fetch sucessfully",
            success: true,
            Bill: bills,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server Error",
            success: false,
        })
    }
}    
export const deleteBill = async (req,res,next) => {
    try {
        const user = req.user._id;
        const {_id} = req.body
        const bill = await Bill.findOneAndDelete({ _id: _id, User: user });
        if (!bill) {
          return res.status(404).json({
            message: "Bill not found or unauthorized",
            success: false,
          });
        }
        res.status(200).json({
          message: "Bill deleted successfully",
          success: true,
        })
        next()
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Internal server error",
          success: false,
        });
      }    
}
