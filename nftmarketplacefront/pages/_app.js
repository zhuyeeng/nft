import '../styles/globals.css';

//Intrnal import
import { NavBar } from '../components/ComponentsIndex';

const MyApp = ({ Component, pageProps }) => (
    <div>
        <NavBar />
        <Component {...pageProps}/>
    </div>
);

export default MyApp;