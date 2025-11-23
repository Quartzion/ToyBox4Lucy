import React from 'react';
import { useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import ReactDOM from "react-dom";
import Overlay from "../Overlay";
import blogs from '../../utils/blogData';
import {
    getExpandedIdx,
    handleToggle,
    closeOverlay,
    useOverlayEffect,
    renderCard
} from '../../utils/cardUtils';

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const expandedIdx = getExpandedIdx(blogs, slug);

  // overlay effect imported from utils
  useOverlayEffect(location, expandedIdx, setSearchParams);

  // toggle handler
  const handleToggleFn = (idx) => handleToggle(blogs, navigate, expandedIdx, idx, "blogs");


  return (
    <section className="blogs-section" role="region" aria-labelledby="blogs">
      <header className="blogs-header">
        <h3 id="blogs">blogs</h3>
      </header>
      <div className="blogs-content">
        {blogs.map((blog, idx) => {
          const isExpanded = expandedIdx === idx;
          return expandedIdx !== -1 && isExpanded
            ? (
              // Hide the background copy of the expanded blog
              <div key={idx} style={{ visibility: "hidden", height: 0 }} />
            )
            : renderCard(blog, idx, expandedIdx, cardRefs, handleToggleFn, false, "blog");
        })}
      </div>
      {expandedIdx !== -1 &&
        ReactDOM.createPortal(
          <Overlay
            className="card-overlay-bg"
            onClose={() => closeOverlay(setSearchParams)}
          >
            {renderCard(blogs[expandedIdx], expandedIdx, expandedIdx, cardRefs, handleToggleFn, true)}
          </Overlay>,
          document.body
        )
      }
    </section>
  );
};
