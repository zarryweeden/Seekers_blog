import {Routes,Route,Link,Navigate} from 'react-router-dom'
import Landing from './assets/Landing'
import Blogs from './assets/Blogs'
import About from './assets/About'
import BlogDetails from './assets/blogDetails'
import CategoryArticles from './assets/CategoryArticles'
import NotFound from './assets/NotFound' 



export default function App(){
  return(
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path='/home' element={<Landing/>} />
        <Route path='/blogs' element={<Blogs/>} />
        <Route path='/about' element={<About/>}/>
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/category/:categoryName" element={<CategoryArticles />} />
        <Route path="*" element={<NotFound />} /> 
        
      </Routes>
    </div>
  )
}