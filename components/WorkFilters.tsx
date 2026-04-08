"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Project } from "@/data";

type Filter = "all" | "design" | "development";

export default function WorkFilters({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [gridView, setGridView] = useState<"rows" | "columns">("rows");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.categories.includes(filter));
  }, [projects, filter]);

  const designCount = projects.filter((p) => p.categories.includes("design")).length;
  const devCount = projects.filter((p) => p.categories.includes("development")).length;

  return (
    <section className="section work-filters once-in" data-scroll-section>
      <div className="container once-in">
        <div className="filter-row">
          <div className="toggle-row">
            <div
              className={`btn btn-normal all-btn ${filter === "all" ? "active" : ""}`}
            >
              <div
                className="btn-click magnetic"
                data-strength="25"
                data-strength-text="15"
                onClick={() => setFilter("all")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFilter("all")}
              >
                <div className="btn-fill" />
                <span className="btn-text">
                  <span className="btn-text-inner change">All</span>
                </span>
              </div>
            </div>
            <div
              className={`btn btn-normal design-btn ${filter === "design" ? "active" : ""}`}
            >
              <div
                className="btn-click magnetic"
                data-strength="25"
                data-strength-text="15"
                onClick={() => setFilter("design")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFilter("design")}
              >
                <div className="btn-fill" />
                <span className="btn-text">
                  <span className="btn-text-inner change">
                    Design
                    <div className="count-nr">{designCount}</div>
                  </span>
                </span>
              </div>
            </div>
            <div
              className={`btn btn-normal development-btn ${filter === "development" ? "active" : ""}`}
            >
              <div
                className="btn-click magnetic"
                data-strength="25"
                data-strength-text="15"
                onClick={() => setFilter("development")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setFilter("development")}
              >
                <div className="btn-fill" />
                <span className="btn-text">
                  <span className="btn-text-inner change">
                    Development
                    <div className="count-nr">{devCount}</div>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid-row">
            <div
              className={`btn btn-normal btn-icon rows-btn ${gridView === "rows" ? "active" : ""}`}
            >
              <div
                className="btn-click magnetic"
                data-strength="25"
                data-strength-text="15"
                onClick={() => setGridView("rows")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setGridView("rows")}
              >
                <div className="btn-fill" />
                <span className="btn-text">
                  <span className="btn-text-inner change">
                    <svg width="20" height="19" viewBox="0 0 20 19">
                      <g fill="currentColor" fillRule="evenodd">
                        <path d="M0 6h20v1H0zM0 0h20v1H0zM0 12h20v1H0zM0 18h20v1H0z" />
                      </g>
                    </svg>
                  </span>
                </span>
              </div>
            </div>
            <div
              className={`btn btn-normal btn-icon columns-btn ${gridView === "columns" ? "active" : ""}`}
            >
              <div
                className="btn-click magnetic"
                data-strength="25"
                data-strength-text="15"
                onClick={() => setGridView("columns")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setGridView("columns")}
              >
                <div className="btn-fill" />
                <span className="btn-text">
                  <span className="btn-text-inner change">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <g fill="currentColor" fillRule="nonzero">
                        <path d="M8 0H0v8h8V0zM7 1v6H1V1h6zM8 12H0v8h8v-8zm-1 1v6H1v-6h6zM20 0h-8v8h8V0zm-1 1v6h-6V1h6zM20 12h-8v8h8v-8zm-1 1v6h-6v-6h6z" />
                      </g>
                    </svg>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        className={`section-wrap section-wrap-work once-in ${gridView === "rows" ? "grid-rows-visible" : "grid-columns-visible"}`}
        data-scroll-section
      >
        <section
          className={`section work-grid small-work-grid grid-fade grid-rows-part ${gridView === "rows" ? "visible" : ""}`}
          style={gridView === "rows" ? { height: "auto" } : { height: 0 }}
        >
          <div className="container">
            <div className="grid-sub-title">
              <div className="flex-col">
                <h5>Client</h5>
              </div>
              <div className="flex-col">
                <h5>Location</h5>
              </div>
              <div className="flex-col">
                <h5>Services</h5>
              </div>
              <div className="flex-col">
                <h5>Year</h5>
              </div>
            </div>
            <ul className="work-items mouse-pos-list-image-wrap all-active">
              {filtered.map((p) => (
                <li
                  key={p.slug}
                  className={`${p.categories.join(" ")} visible`}
                >
                  <div className="stripe animate" />
                  <Link href={`/work/${p.slug}`} className="row">
                    <div className="flex-col">
                      <h4>
                        <span>{p.titleDisplay}</span>
                      </h4>
                    </div>
                    <div className="flex-col animate">
                      <p>{p.location}</p>
                    </div>
                    <div className="flex-col animate">
                      <p>{p.services}</p>
                    </div>
                    <div className="flex-col animate">
                      <p>{p.year}</p>
                    </div>
                  </Link>
                </li>
              ))}
              <div className="stripe last animate" />
            </ul>
          </div>
        </section>

        <section
          className={`section work-tiles grid-fade grid-columns-part ${gridView === "columns" ? "visible" : ""}`}
          style={gridView === "columns" ? { height: "auto" } : { height: 0 }}
        >
          <div className="container">
            <ul>
              {filtered.map((p) => (
                <li
                  key={p.slug}
                  className={`${p.categories.join(" ")} visible`}
                >
                  <div className="single-tile-wrap">
                    <Link href={`/work/${p.slug}`} className="row">
                      <div className="flex-col">
                        <div className="tile-image">
                          <div
                            className="overlay overlay-color"
                            style={{ backgroundColor: p.thumbnailBg }}
                          />
                          <div
                            className="overlay overlay-image lazy"
                            style={{
                              backgroundPosition: "center center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundImage: `url(${p.thumbnailUrl})`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-col">
                        <h4>
                          <span>{p.titleDisplay}</span>
                        </h4>
                        <div className="stripe" />
                      </div>
                      <div className="flex-col">
                        <p>{p.services}</p>
                      </div>
                      <div className="flex-col">
                        <p>{p.year}</p>
                      </div>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </section>
  );
}
