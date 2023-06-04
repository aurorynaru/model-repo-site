import {
    BrowserRouter,
    Route,
    Routes,
    Navigate,
    useNavigate
} from 'react-router-dom'
import Home from './pages/Home'
import Registration from './pages/Registration'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import PostModel from './pages/PostModel'

function App() {
    const isAuth = Boolean(useSelector((state) => state.token))

    return (
        <div className=' dark:bg-body bg-neutral-100-100 text-neutral-900 dark:text-neutral-100 transition duration-500 ease-in-out'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/home' />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route
                        path='/models/post'
                        element={isAuth ? <PostModel /> : <Login />}
                    />
                    <Route path='/register' element={<Registration />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
