
const LandingPage: React.FC = ()=>{
    return (
        <div>Landing 
            page 
            <a href={`${process.env.REACT_APP_URL}/login`}> Login Page</a>
        </div>
    )
}

export default LandingPage;