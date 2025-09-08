import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setContacts } from '../store/slicer/ContactSlice'
import { AnimatePresence, motion as Motion } from "framer-motion";
import ContactExpense from './ContactExpense';

const Contact = () => {
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.user?.user)
  const contacts = useSelector((state) => state.Contacts?.Contacts || [])
  const expenses = useSelector((state) => state.expense?.expense || [])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('group')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [GroupExpense, setGroupExpense] = useState([])
  const [NonGroupExpense, setNonGroupExpense] = useState([])
  const [Contact, setContact] = useState([])
  const [pid, setpid] = useState('')
  const [totalGroupSpending, settotalGroupSpending] = useState(0)
  const [totalNonGroupSpending, settotalNonGroupSpending] = useState(0)


  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch('http://localhost:7000/Home/contacts', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) {
          throw new Error('Failed to fetch contacts')
        }
        const data = await res.json()
        dispatch(setContacts(Array.isArray(data?.Contact) ? data.Contact : []))
      } catch (err) {
        setError(err?.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchContacts()
    }
  }, [currentUser, dispatch])

  const ExpenseShow = (person) => {
    if (!person || !person._id) return;
    const selectedPersonId = person._id?.toString?.()
    setpid(selectedPersonId)
    const currentUserId = currentUser?._id?.toString?.() || currentUser?._id;

    setContact(person)

    const groupExps = expenses.filter((exp) => {
      if (!exp?.Group) return false;
      const members = Array.isArray(exp?.Members) ? exp.Members : [];
      const ensurePerson = members.some((m) =>{ 
        return((m?._id?.toString?.() || m?._id) === selectedPersonId)
               })
      const ensureUser = members.some((m) =>{ 
        return((m?._id?.toString?.() || m?._id) === currentUserId)
      })
      const Include = exp.PaidBy?._id === selectedPersonId || exp.PaidBy?._id === currentUserId
      return ensurePerson && ensureUser && Include
    })

    const nonGroupExps = expenses.filter((exp) => {
      if (exp?.Group) return false;
      const members = Array.isArray(exp?.Members) ? exp.Members : [];
      if (members.length !== 2) return false;
      const ensurePerson = members.some((m) =>{ 
        return((m?._id?.toString?.() || m?._id) === selectedPersonId)
               })
      const ensureUser = members.some((m) =>{ 
        return((m?._id?.toString?.() || m?._id) === currentUserId)
      })
      const Include = exp.PaidBy?._id === selectedPersonId || exp.PaidBy?._id === currentUserId
      return ensurePerson && ensureUser && Include
    })
    const GroupSpending = groupExps.filter((g)=>g.PaidBy._Id===pid||g.PaidBy._id===currentUser._id).reduce((s,e)=>s+e.Price,0)
    const nonGroupSpending = nonGroupExps.filter((g)=>g.PaidBy._Id===pid||g.PaidBy._id===currentUser._id).reduce((s,e)=>s+e.Price,0)
    settotalGroupSpending(GroupSpending)
    settotalNonGroupSpending(nonGroupSpending)
    setGroupExpense(groupExps)
    setNonGroupExpense(nonGroupExps)
  }
  console.log(GroupExpense)
  const filtered = useMemo(() => {
    if (!search?.trim()) return contacts
    const query = search.trim().toLowerCase()
    return contacts.filter((c) => {
      const memberTexts = (c?.Users || []).map((u) => `${u?.name || ''} ${u?.email || ''}`.toLowerCase())
      return memberTexts.some((t) => t.includes(query))
    })
  }, [contacts, search, selectedIndex])

  useEffect(() => {
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(0)
    }
  }, [filtered, selectedIndex])

  const selected = filtered[selectedIndex]
  const otherMembers = useMemo(() => {
    if (!selected?.Users) return []
    const currentId = currentUser?._id?.toString()
    return selected.Users.filter((u) => u?._id?.toString() !== currentId)
  }, [selected, currentUser])



  console.log(expenses)

  return (
    <div className="min-h-screen sm:p-8 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-1 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-4 backdrop-blur-sm h-[95vh]"
        >
          <div className="flex items-center gap-2 mb-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts by name or email"
              className="w-full bg-slate-700/60 border border-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-300"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-slate-700/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-slate-300 text-sm">No contacts found.</div>
          ) : (
            <ul className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
              {filtered.map((c, idx) => {
                const currentId = currentUser?._id?.toString()
                const members = (c?.Users || []).filter((u) => u?._id?.toString() !== currentId)
                const title = members.map((m) => m?.name || m?.email).join(', ')
                const subtitle = members.map((m) => m?.email || '').filter(Boolean).join(' • ')
                const isActive = idx === selectedIndex
                return (
                  <li key={c?._id || idx}>
                    <button
                      onClick={() => {
                        setSelectedIndex(idx)
                        ExpenseShow(members[0])
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition ring-1 ring-transparent hover:ring-blue-400/40 ${isActive ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-700/60 border-slate-600 hover:bg-slate-700'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                          {(title?.[0] || 'C').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{title}</div>
                          <div className="text-xs text-slate-300 truncate">{subtitle}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Motion.div>

        {/* Right panel: details */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-2 pr-4 md:pr-16 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl p-5 backdrop-blur-sm"
        >
          {!selected ? (
            <div className="text-slate-300">Select a contact to view details.</div>
          ) : (
            <div className="h-full w-full flex">
              {/* Left: Expense Tabs & Content */}
              <div className="w-full md:w-2/3 flex flex-col">
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-700/40 p-1 rounded-xl w-fit mb-2">
                  <button
                    onClick={() => setActiveTab('group')}
                    className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'group' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:text-white'}`}
                  >
                    <div className="">Group Expense</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('nonGroup')}
                    className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'nonGroup' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:text-white'}`}
                  >
                    Non‑Group Expenses
                  </button>
                </div>
                {/* Content (IDs only currently) */}
                {activeTab === 'group' ? (
                  <div className="">
                    {GroupExpense.length === 0 ? (
                      <div className="text-slate-300 text-sm">No group expenses yet.</div>
                    ) : (
                      <ul className="relative">
                        <div className="relative bg-gradient-to-br from-amber-100/80 to-green-100/80 shadow-lg rounded-xl lg:h-[85vh] sm:overflow-y-auto overflow-y-auto p-4 w-full md:w-96">
                          <AnimatePresence>
                            {GroupExpense && GroupExpense.map((exp, idx) => {
                              const isCurrentUser = exp.PaidBy._id === currentUser._id
                              return (
                                <Motion.li
                                  key={exp._id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                  whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 4px 24px 0 rgba(34,197,94,0.15)",
                                  }}
                                  className={`
                                    relative flex flex-col justify-between
                                    rounded-2xl shadow-md p-2 min-w-76 max-w-84
                                    transition-all duration-200 my-1
                                    ${isCurrentUser
                                      ? "bg-gradient-to-r from-green-300/95  to-green-200/75 rounded-br-none ml-12"
                                      : "bg-gradient-to-r from-yellow-200/75  to-yellow-300/75 rounded-bl-none mr-12"
                                    }
                                    hover:shadow-xl hover:-translate-y-1
                                  `}
                                  style={{ minWidth: 0 }}
                                >
                                  <div className="flex flex-col">
                                    <div className="text-center font-bold text-xl text-green-800 break-words">
                                      {exp.Item}
                                    </div>
                                    <div className="flex justify-between items-center text-base font-medium text-green-900">
                                      <span className="truncate">{exp.Group?.GroupName?.toUpperCase()}</span>
                                      <span className="bg-green-300/80 px-4 py-1 rounded-full shadow-inner text-sm font-semibold">
                                        ₹{exp.Price}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-green-700 mt-2">
                                      <span className="font-semibold break-words">{exp.PaidBy?.name?.toUpperCase()}</span>
                                      <span className="bg-slate-200 px-3 py-1 rounded-full shadow text-xs">
                                        {exp.Date ? new Date(exp.Date).toLocaleDateString() : "No date"}
                                      </span>
                                    </div>
                                  </div>
                                  {isCurrentUser && (
                                    <span className="absolute top-2 left-2 bg-green-400 text-white text-xs px-3 py-1 rounded-full shadow">
                                      You Paid
                                    </span>
                                  )}
                                  {!isCurrentUser && (
                                    <span className="absolute top-2 left-2 bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow">
                                      Contact Paid
                                    </span>
                                  )}
                                </Motion.li>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="">
                    {NonGroupExpense.length === 0 ? (
                      <div className="text-slate-300 text-sm">No non‑group expenses yet.</div>
                    ) : (
                      <ul className="relative">
                        <div className="relative bg-gradient-to-br from-green-100/80 to-amber-100/80 shadow-lg rounded-xl lg:h-[85vh] overflow-y-auto p-4 w-full md:w-96">
                          <AnimatePresence>
                            {NonGroupExpense.map((exp, idx) => {
                              const isCurrentUser = exp.PaidBy._id === currentUser._id
                              return (
                                <Motion.li
                                  key={exp._id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                  whileHover={{
                                    scale: 1.04,
                                    boxShadow: "0 4px 24px 0 rgba(34,197,94,0.15)",
                                  }}
                                  className={`
                                    relative flex flex-col justify-between
                                    rounded-2xl shadow-md p-2 min-w-76 max-w-84
                                    transition-all duration-200 my-1
                                    ${isCurrentUser
                                      ? "bg-gradient-to-r from-green-300/95  to-green-200/75 rounded-br-none ml-12"
                                      : "bg-gradient-to-r from-yellow-200/75  to-yellow-300/75 rounded-bl-none mr-12"
                                    }
                                    hover:shadow-xl hover:-translate-y-1
                                  `}
                                  style={{ minWidth: 0 }}
                                >
                                  <div className="flex flex-col">
                                    <div className="text-center font-bold text-xl text-green-800 break-words">
                                      {exp.Item}
                                    </div>
                                    <div className="flex justify-between items-center text-base font-medium text-green-900">
                                      <span className="truncate">Personal</span>
                                      <span className="bg-green-300/80 px-4 py-1 rounded-full shadow-inner text-sm font-semibold">
                                        ₹{exp.Price}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-green-700 mt-2">
                                      <span className="font-semibold break-words">{exp.PaidBy?.name?.toUpperCase()}</span>
                                      <span className="bg-slate-200 px-3 py-1 rounded-full shadow text-xs">
                                        {exp.Date ? new Date(exp.Date).toLocaleDateString() : "No date"}
                                      </span>
                                    </div>
                                  </div>
                                  {isCurrentUser && (
                                    <span className="absolute top-2 left-2 bg-green-400 text-white text-xs px-3 py-1 rounded-full shadow">
                                      You Paid
                                    </span>
                                  )}
                                  {!isCurrentUser && (
                                    <span className="absolute top-2 left-2 bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow">
                                      Contact Paid
                                    </span>
                                  )}
                                </Motion.li>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </ul>
                    )}
                  </div>
                )}
                {/* Contact Expense Detail moved to left side */}
              </div>
              {/* Right: Contact Details */}
              {
                Contact && Contact._id && <div className="w-full md:w-1/3">
                  <div className=" flex flex-col  items-center justify-start gap-4 h-full">
                    {/* Contact Name & Emails */}
                    <div className="bg-slate-700/70 rounded-xl p-4 mb-2 shadow mx-auto">
                      <div className="text-2xl font-bold text-center text-blue-200 mb-1">
                        {otherMembers.length > 0
                          ? otherMembers.map((m) => m?.name || m?.email).join(', ')
                          : 'Contact'}
                      </div>
                      <div className="text-xs text-slate-300 text-center">
                        {otherMembers.map((m) => m?.email).filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mx-auto">
                      <div className="bg-gradient-to-br from-green-400/20 to-green-200/10 rounded-xl p-4 text-center shadow hover:scale-105 transition">
                        <div className="text-xs text-slate-400 mb-1">Group Total</div>
                        <div className="font-bold text-green-700 text-lg">₹{totalGroupSpending} </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-400/20 to-amber-200/10 rounded-xl p-4 text-center shadow hover:scale-105 transition">
                        <div className="text-xs text-slate-400 mb-1">Non‑Group Total</div>
                        <div className="font-bold text-amber-700 text-lg">₹{totalNonGroupSpending} </div>
                      </div>
                      <div className="bg-slate-700/60 rounded-xl p-4 text-center shadow">
                        <div className="text-xs text-slate-400 mb-1">Group Count</div>
                        <div className="font-semibold text-blue-200 text-lg">{GroupExpense?.length}</div>
                      </div>
                      <div className="bg-slate-700/60 rounded-xl p-4 text-center shadow">
                        <div className="text-xs text-slate-400 mb-1">Non‑Group Count</div>
                        <div className="font-semibold text-blue-200 text-lg">{NonGroupExpense?.length}</div>
                      </div>
                    </div>
                    <ContactExpense
                      contact={Contact}
                      user={currentUser}
                    />
                  </div>
                </div>
              }
            </div>
          )}
        </Motion.div>
      </div>
    </div >
  )
}

export default Contact