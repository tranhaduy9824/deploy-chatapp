export const PinIcon = () => (
  <svg
    viewBox="0 0 36 36"
    className="x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq x19dipnz"
    fill="currentColor"
    height="16"
    width="16"
    style={{ color: "var(--placeholder-icon" }}
  >
    <g filter="url(#:rf5:)">
      <rect fill="url(#:rf6:)" height="2" width="8" x="17" y="26"></rect>
    </g>
    <path
      d="M23.9989 27.5928L23.9988 27.5383L24.0367 27.585C24.1817 27.7518 24.7409 28.2715 25.8875 27.9427C26.9382 27.6414 26.5281 26.8227 26.371 26.5705C26.3138 26.4819 26.2525 26.3965 26.1873 26.3135L16.8703 14.3899C16.2845 15.045 15.5884 15.6539 14.8084 16.0737L23.9989 27.5928Z"
      fill="url(#:rf7:)"
    ></path>
    <path
      d="M11.5653 17.1305C15.7434 17.1305 19.1305 13.7434 19.1305 9.56526C19.1305 5.38708 15.7434 2 11.5653 2C7.38708 2 4 5.38708 4 9.56526C4 13.7434 7.38708 17.1305 11.5653 17.1305Z"
      fill="#FF0D0D"
    ></path>
    <path
      d="M9.19306 12.5345C6.38338 10.2164 5.72669 6.37369 7.72578 3.95078C9.72486 1.52787 13.6231 1.44245 16.432 3.76062C19.2417 6.07879 19.8984 9.92145 17.8993 12.3444C15.9002 14.7673 12.0019 14.8519 9.19306 12.5345Z"
      fill="url(#:rf8:)"
    ></path>
    <defs>
      <filter
        color-interpolation-filters="sRGB"
        filterUnits="userSpaceOnUse"
        height="2.8"
        id=":rf5:"
        width="8.8"
        x="16.6"
        y="25.6"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        ></feBlend>
        <feGaussianBlur
          result="effect1_foregroundBlur_28_51"
          stdDeviation="0.2"
        ></feGaussianBlur>
      </filter>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id=":rf6:"
        x1="25"
        x2="17.6667"
        y1="27"
        y2="27"
      >
        <stop stop-color="#969495"></stop>
        <stop offset="1" stop-color="#D9D9D9" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id=":rf7:"
        x1="20.4956"
        x2="21.941"
        y1="22.4135"
        y2="21.2698"
      >
        <stop stop-color="#666666"></stop>
        <stop offset="1" stop-color="#CACCCD"></stop>
      </linearGradient>
      <radialGradient
        cx="0"
        cy="0"
        gradientTransform="translate(12.8132 8.1471) rotate(129.523) scale(5.68739 6.59482)"
        gradientUnits="userSpaceOnUse"
        id=":rf8:"
        r="1"
      >
        <stop stop-color="white" stop-opacity="0.5"></stop>
        <stop offset="1" stop-color="white" stop-opacity="0"></stop>
      </radialGradient>
    </defs>
  </svg>
);

export const FontIcon: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="currentColor"
    width="21"
    height="21"
    className="x19dipnz x1lliihq x1tzjh5l"
    style={{ color: "var(--icon-primary-color)", ...style }}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.243 12.238a.368.368 0 0 0-.35.255l-2.18 6.675a.25.25 0 0 0 .238.328h4.584a.25.25 0 0 0 .238-.328l-2.18-6.675a.369.369 0 0 0-.35-.255zm5.802 13.755a1.44 1.44 0 0 1-1.365-.982l-.928-2.844a.25.25 0 0 0-.238-.173H8.973a.25.25 0 0 0-.238.173l-.929 2.844a1.44 1.44 0 1 1-2.722-.94L9.83 10.7a2.563 2.563 0 0 1 4.829 0l4.744 13.37a1.44 1.44 0 0 1-1.357 1.922zm11.207-5.475a.25.25 0 0 0-.266-.25l-2.805.176c-1.659.108-2.434.709-2.434 1.779 0 1.105.942 1.766 2.255 1.766 1.79 0 3.25-1.166 3.25-2.692v-.78zm1.409 5.46a1.33 1.33 0 0 1-1.339-1.336c0-.098-.139-.138-.198-.06-.803 1.058-2.387 1.668-3.925 1.668-2.475 0-4.198-1.56-4.198-3.9 0-2.316 1.7-3.9 4.82-4.088l3.195-.185a.25.25 0 0 0 .236-.25v-.762c0-1.252-1.032-1.829-2.603-1.829-2.066 0-2.316 1.24-3.333 1.24-1.13 0-1.745-1.354-.968-2.172.933-.982 2.349-1.556 4.254-1.556 3.295 0 5.398 1.603 5.398 4.317v7.577a1.33 1.33 0 0 1-1.34 1.335z"
    ></path>
  </svg>
);
