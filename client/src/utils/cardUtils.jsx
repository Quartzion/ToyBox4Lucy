import React from 'react';
import ReactMarkdown from 'react-markdown'
import slugify from "slugify";
import { Button } from "react-bootstrap";
import ConnectWithUs from '../components/ConnectWithUs';

// Get expanded index from slug
export function getExpandedIdx(data, slug) {
    return data.findIndex(
        item => slugify(item.title, { lower: true, strict: true }) === slug
    );
};

// get slug from title
export function getSlug(title) {
    return slugify(title, { lower: true, strict: true });
};

// handle expand/collapse navigation
export function handleToggle(data, navigate, expandedIdx, idx, route = "blogs") {
    if (expandedIdx === idx) {
        // Collapse overlay and scroll to section
        navigate(`/`, { replace: false });

        // Scroll to section anchor manually
        setTimeout(() => {
            const target = document.getElementById(route);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    } else {
        const slug = getSlug(data[idx].title);
        navigate(`/${route}?slug=${slug}`, { replace: false });
    }
}


// close overlay
export const closeOverlay = (setSearchParams) => {
    setSearchParams({});
};



// overlay effect logic
export function useOverlayEffect(location, expandedIdx, setSearchParams) {
    React.useEffect(() => {
        const currentSlug = new URLSearchParams(location.search).get('slug');
        if (!currentSlug && expandedIdx !== -1) {
            closeOverlay(setSearchParams);
        };


    }, [location, expandedIdx, setSearchParams]);
};

// render blog card
export function renderCard(item, idx, expandedIdx, cardRefs, handleToggle, isOverlay = false, type = "blog") {
    return (
        <section
            aria-labelledby={`card-${idx}`}
            id={`card-${idx}`}
            ref={el => {
                if (!cardRefs.current) cardRefs.current =[];
                    cardRefs.current[idx] = el;
                }}
            className={`${type}-card${expandedIdx !== -1 && expandedIdx !== idx ? " blurred" : ""}${expandedIdx === idx ? " expanded" : ""}${isOverlay ? " overlay" : ""}`}
            key={idx}
        >
            <img
                src={item.img}
                alt={`Thumbnail for ${type}-${idx}`}
                className="card-image"
                loading='lazy'
            />
            <article id={`${type}-card-${idx}`} className={`${type}-card-content`}>
                <header>
                    <h4>{item.title}</h4>
                </header>
                    <ReactMarkdown>
                        {expandedIdx === idx
                        ? item.content
                        : item.content.slice(0, 250) + (item.content.length > 250 ? "..." : "")
                        }
                    </ReactMarkdown>
                    {expandedIdx === idx ? <ConnectWithUs /> : ''}
                <div className="card-footer">
                    <Button
                        className='card-btn'
                        to="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleToggle(idx);
                        }}
                        aria-label={`Read more about ${item.title}`}
                    >
                        {expandedIdx === idx ? "Show less" : `Click here to expand this ${type}`}
                    </Button>
                </div>
            </article>
        </section>
    );
};