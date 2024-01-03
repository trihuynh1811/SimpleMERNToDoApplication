import React, { useEffect, useMemo, useState, useRef } from "react";
import "../css/output.css"
import axios from "axios";
import "../css/customCheckBox.css"

let baseURL = process.env.REACT_APP_BACKEND_URL

function Main() {
    const [tasks, setTasks] = useState([])
    const [editId, setEditId] = useState(0)
    const [listHeight, setListHeight] = useState(0)
    const olRef = useRef(null)

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await axios.get(baseURL + "/tasks", {
                headers: {
                    crossDomain: true,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    const data = res.data.tasks
                    console.log(data)
                    setTasks(data)
                }
            }).catch(err => console.log(err))

        }
        fetchTasks()
    }, [])

    useEffect(() => {
        if (olRef.current !== null) {
            setListHeight(olRef.current.offsetHeight)
        }
    }, [tasks])

    const editTask = async (id) => {
        setEditId(id)
    }

    const cancelEditTask = async () => {
        setEditId(0)
    }

    const submitEditedTask = async (e, id) => {
        e.preventDefault()
        const data = {
            id: id,
            name: e.target.editTaskInput.value,
            finish: e.target.checkBoxInput.checked
        }
        const res = await axios.put(baseURL + "/task", data, {
            headers: {
                crossDomain: true,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200) {
                console.log(res.data.task)
                e.target.editTaskInput.value = res.data.task.name
                const updatedTasks = tasks.map((task) => task._id === res.data.task._id ? { ...task, name: res.data.task.name, finish: res.data.task.finish } : task)
                setTasks(updatedTasks)
                cancelEditTask()
            }
        }).catch(err => console.log(err))
    }

    const deleteTask = async (id) => {
        const res = await axios.delete(baseURL + `/task`, { data: { taskID: id } }, {
            headers: {
                crossDomain: true,
                "Content-Type": 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setTasks(tasks =>
                    tasks.filter(task => {
                        return task._id !== id;
                    }),
                );
            }
        }).catch(err => console.log(err))
    }

    const deleteAllTasks = async () => {
        const res = await axios.delete(baseURL + "/tasks").then(res => {
            console.log(res.data)
            setTasks([])
        }).catch(err => console.log(err))
    }

    const addTask = async (e) => {
        e.preventDefault()

        const data = {
            name: e.target.task.value
        }

        const res = await axios.post(baseURL + "/task", data, {
            headers: {
                crossDomain: true,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 201) {
                const newTask = res.data.newTask
                e.target.task.value = ""
                setTasks([...tasks, newTask])
            }
        }).catch(err => console.log(err))
    }

    const getCheckBoxValue = (e) => {
        console.log(e.target.value)
    }

    const renderTasks = useMemo(() => {
        return tasks.map((task) => {
            return (
                <li className={task.finish ? "px-2 py-2 bg-orange-400 mb-2 rounded-lg" : "px-2 py-2 bg-slate-100 mb-2 rounded-lg"} key={task._id} id={task._id}>
                    {editId !== task._id ? (
                        <>
                            <div>{task.name}</div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-blue-300 px-2 py-1 rounded-lg" onClick={() => editTask(task._id)}>edit</button>
                                <button type="button" className="ml-2 bg-red-300 px-2 py-1 rounded-lg" onClick={() => deleteTask(task._id)}>delete</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <form onSubmit={(e) => submitEditedTask(e, task._id)}>
                                <div className="my-2 flex">
                                    <input className="editTaskInput px-2 py-1 flex-1 rounded-lg bg-slate-300" name="editTaskInput" type="text" defaultValue={task.name} data-id={task._id} />
                                    <label className="container block h-inherit flex-[0.1] ml-2">
                                        <input className="checkBoxInput" name="checkBoxInput" type="checkbox" onChange={e => getCheckBoxValue(e)} defaultChecked={task.finish} />
                                        <span className="checkmark h-full w-full rounded-lg bg-slate-300"></span>
                                    </label>

                                </div>
                                <div className="flex justify-end mb-2">
                                    <button type="submit" className="bg-blue-300 px-2 py-1 rounded-lg">submit</button>
                                    <button type="button" className="ml-2 bg-red-300 px-2 py-1 rounded-lg" onClick={cancelEditTask}>cancel</button>
                                </div>
                            </form>

                        </>
                    )}

                </li>
            )
        })
    }, [tasks, editId])

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <form className="flex flex-col" onSubmit={(e) => addTask(e)}>
                <h1 className="mb-2">Tasks Management</h1>
                <div className="flex">
                    <div>
                        <input
                            type="text"
                            id="task"
                            name="task"
                            autoComplete="off"
                            className="px-2 py-2 outline-none bg-slate-500"
                        />
                    </div>
                    <button type="submit"
                        className="box-border text-sm h-full text-black bg-slate-300 hover:bg-slate-400"
                    >Add New Task</button>

                </div>
            </form>
            <main className="app-main w-1/2 flex flex-col justify-center items-center mt-3">
                <h2>ToDo</h2>
                {tasks && tasks.length > 0 ? (
                    <>
                        <ol className="w-[60%] max-h-[500px]" ref={olRef}
                            style={{ overflowY: listHeight > 480 ? 'scroll' : 'unset' }}
                        >
                            {renderTasks}
                        </ol>
                        <button className="bg-red-500 font-semibold px-2 py-2 rounded-lg" onClick={deleteAllTasks}>delete all</button>
                    </>
                ) : (
                    <p>No tasks yet</p>
                )}
            </main>
        </div>
    )
}

export default Main