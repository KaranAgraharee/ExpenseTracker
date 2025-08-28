import { React, useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'



const CreateGrp = () => {

  const user = useSelector((state)=>state.user?.user)
  
  const [query, setquery] = useState('')
  const [member, setmember] = useState([])
  const [searchId, setsearchId] = useState([])
  const [CreateGroupOpen, setCreateGroupOpen] = useState(false)


  const { register, handleSubmit, reset } = useForm()


  const handleChange = async (e) => {
    const value = e.target.value
    
    if (value.includes('\\')) {
      setquery(value);
      setsearchId([]);
      return;
    }
    
    setquery(value);
    if (value.length > 3) {
      const response = await fetch(`http://localhost:7000/Auth/user/search?query=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }

      })
      const data = await response.json()
      setsearchId(data)
    }else{
      setsearchId([])
    }
  } 
  
  const handleSelect = (e) => {
    const id = e.currentTarget.dataset.id
    const selectedMember = searchId.find(member => member._id === id)
    if (selectedMember && Array.isArray(member) && !member.some(m => m._id === id)) {
      setmember((prev) => [...prev, selectedMember])
    }
  }

  const removeMem = (e) => {
    const id = e.currentTarget.dataset.id
    if (Array.isArray(member)) {
      const removeMember = member.filter(member => member._id !== id) 
      setmember(removeMember)
    }
  }
  
  const CancelGroup = () => {
    reset()
    setCreateGroupOpen(false)
  }
  
  const onSubmit = async(data) => {
    try {
      const memberIds = Array.isArray(member) ? member.map(m => m._id) : []
      console.log("ID:",user)
      const updatedMembers = [...memberIds, user._id]
      console.log(updatedMembers)
      const groupData = {
        name: data.GroupName, 
        members: updatedMembers,
      }
      console.log('Sending group data:', groupData)
      const res = await fetch('http://localhost:7000/Home/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(groupData)
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Server error:', errorData)
        return
      }

      const result = await res.json()
      console.log('Group created successfully:', result)
      reset()
      setmember([]) 
      setCreateGroupOpen(false)
    } catch (error) {
      console.error('Error creating group:', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <AnimatePresence>
        {CreateGroupOpen ? (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg  text-gray-700 shadow-lg p-6 w-full max-w-md mx-2"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input type="text" placeholder="Group Name" {...register('GroupName')} className="border p-2 rounded-md" />
                <input
                  type="text"
                  placeholder="Search Member by name or email"
                  value={query}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
                <div className="max-h-32 overflow-y-auto">
                  <AnimatePresence>
                    {searchId.map((mem) => (
                      <motion.button
                        type="button"
                        key={mem._id}
                        data-id={mem._id}
                        onClick={handleSelect}
                        className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded mb-1 flex flex-col"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="font-semibold">{mem.name}</span>
                        <span className="text-xs text-gray-500">{mem.email}</span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-2 my-2">
                  <AnimatePresence>
                    {Array.isArray(member) && member.map(m => (
                      <motion.span
                        key={m._id}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {m.name}
                        <button data-id={m._id} onClick={removeMem} type='button' className='w-6 h-6 flex items-center justify-center'>
                          <img src="icon/remove.png" alt="remove" className="w-4 h-4" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2 mt-2">
                  <input type="submit" value="Create Group" className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 cursor-pointer transition" />
                  <button type="button" onClick={CancelGroup} className='flex-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded px-4 py-2 transition'>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {!CreateGroupOpen && (
        <motion.button
          onClick={() => setCreateGroupOpen(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-8 py-2 my-4 transition shadow-lg'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
        >
          Create New Group
        </motion.button>
      )}
    </div>
  )
}

export default CreateGrp
