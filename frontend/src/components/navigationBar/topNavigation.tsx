import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'



const TopNavigation: React.FC = () => {
    
    return (
      <>

        <nav className="navbar navbar-expand-lg fixed-top mx-auto mymodemenu">
            <div className="container-fluid">
              <div className="mx-2 d-inline-block">
                <span className="d-inline-block menu-icon"> 
                  <FontAwesomeIcon icon={icon({name: 'calendar'})} />
                </span>
                <span className="d-none d-lg-inline-block"> 
                  Academic Calender
                </span>
              </div>
                <span className="d-inline-block menu-icon">
                  <FontAwesomeIcon icon={icon({name: 'right-to-bracket'})} />
                </span>
              <span className="d-none d-lg-inline-block"> 
                Login
              </span>
            </div>
        </nav>
      </>
    )
}
export default TopNavigation