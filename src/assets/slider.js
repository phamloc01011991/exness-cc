import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import $ from "jquery";

function Slider() {
    return (
        <div style={{
            padding:'0px 10px'
        }}>
            <OwlCarousel 
                className='owl-theme' 
                margin={10} 
                nav={false}
                items='1'
                dots={false}
                autoPlay={true}
                loop 
                style={{
                    boxShadow:'0 0 5px 5px #d5d5d5',
                }}
                >
                    <div className='item' style={{
                         boxShadow:'0 0 5px 5px #d5d5d5',
                    }}>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
                    <div className='item'>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
                    <div className='item'>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
                    <div className='item'>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
                    <div className='item'>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
                    <div className='item'>
                        <img src='https://www.timedoctor.com/blog/images/2022/02/meeting-agenda-template1.jpg' />
                    </div>
            </OwlCarousel>
        </div>
    );
  }
  
  export default Slider;
  
  