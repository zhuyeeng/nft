import '../styles/globals.css';

//Intrnal import
import { NavBar, Footer } from '../components/ComponentsIndex';

const MyApp = ({ Component, pageProps }) => (
    <div>
        <NavBar />
        <Component {...pageProps}/>
        <Footer />
    </div>
);

export default MyApp;