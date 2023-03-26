import React from 'react'
import {AppContent} from '../components/AppContent'
import AppHeader from "../components/AppHeader";

const DefaultLayout = () => {
  return (
    <div>
      {/*<AppSidebar />*/}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
