import styles from "./Blogs.module.css"
import searchImg from "../assets/search.png"
import bookmark from "../assets/bookmark.png"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import axios from "axios";
// import moment from "moment"
// import Loader from "./Loader"
// import {Helmet} from "react-helmet";
import placeholderImage from "../assets/placeholder.webp"
import moment from "moment"

function Blogs() {

    let [blogs, setBlogs] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    let navigate = useNavigate()


    function Card (props) {
        return <div style={{marginBottom:'60px'}} onClick={props.onClick}>
           <div className={styles.card}>
            <img src={!props.thumbnail || props.thumbnail == '' ? placeholderImage : props.thumbnail} />
            <div className={styles.title}>
                <h3>{props.title}</h3>
                <h4>{props.shortDesc}</h4>
            </div>
        </div>
        <div className={styles.c}>
        <p>{props.date}</p>
        <img className={styles.bookmark} src={bookmark} />
        </div>
        </div>
    }

    let _getAllBlogs = async () => {
        setLoading(true)
        let res = await axios.get(process.env.REACT_APP_API + '/allblogs')
        console.log("🚀 ~ file: Blogs.js ~ line 40 ~ let_getAllBlogs= ~ res", res.data)
        if(res.status == 200){
            setLoading(false)
            setBlogs(res.data)
        }
    }

    useEffect(()=>{
        _getAllBlogs()
    },[])

    return <div className={styles.blogs}>
         <form className={styles.search}>
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search for blogs..." type="text" />
                <button onClick={(e)=>e.preventDefault()} type="submit"><img src={searchImg}/></button>
        </form>

        <div className={styles.cards}>
           {blogs.length == 0 ? <p style={{color:'#a4a4a4',textAlign:'left'}}>No blogs posted!</p> : blogs.map(blog => {
                return blog.title.toLowerCase().includes(search.toLowerCase()) || search == '' ?
                    // <div>blog</div>
                    <Card onClick={ () => navigate('/details', { state: blog }) }
                        thumbnail={ blog.thumbnail }
                        title={ blog.title } date={ moment(blog.createdAt).format('DD/MM/YYYY') }
                        shortDesc={ blog.shortDesc.substr(0, 100) } /> 
                 : null
            })}
        </div>


    </div>
}

export default Blogs