import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom"
import OrderDetails from "./Components/OrderDetails"
import OrderList from "./Components/OrderList"
import CreateOrder from "./Components/CreateOrder"
import { AppProvider } from "./Contexts/AppContext"
import { Toaster } from "react-hot-toast"
import NotFound from "./Components/NotFound"


function App() {


  return (
    <BrowserRouter>
    <AppProvider>
    <Toaster/>
    <Routes>
    <Route index element={<Navigate replace to="orders" />} /> {/* Default Navigation to orders list on index*/}
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/new" element={<CreateOrder editMode={false}/>} />
      <Route path="/orders/:id" element={<CreateOrder editMode={true}/>} />
      <Route path="/orders/details/:id" element={<OrderDetails />} />
      <Route path="*" element={<NotFound />} /> {/* Catch-all route */}

    </Routes>
    </AppProvider>
  </BrowserRouter>
  )
}

export default App
