import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const FacebookPixel = () => {
    const location = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        const initPixel = () => {
            if (window.fbq) {
                window.fbq('init', import.meta.env.PIXEL_ID);

            } else {
                setTimeout(initPixel, 100);
            }
        };
        initPixel();
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

    }, [location.pathname]);

    return (
        <>
            <Helmet>
                <script>
                    {
                        `!function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '1388814573075727');
                    `
                    }

                </script>

            </Helmet>
            <noscript>
                <img height="1" width="1"
                    src="https://www.facebook.com/tr?id=1373501164609400&ev=PageView
&noscript=1"/>
            </noscript>
        </>);
};

export default FacebookPixel;
