export default function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="1.5" fill="none" fillRule="evenodd">
          <g transform="translate(1026 286) rotate(90) translate(-1026 -286) translate(1020 280)">
            <polyline points="2.76923077 0 12 0 12 9.23076923" />
            <line x1="12" y1="0" x2="0" y2="12" />
          </g>
        </g>
      </svg>
    </span>
  );
}
