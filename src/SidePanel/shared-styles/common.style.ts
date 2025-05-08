import { css } from "lit";

export const structuralStyles = css`
  .text-start {
    text-align: left !important;
  }

  .text-end {
    text-align: right !important;
  }

  .text-center {
    text-align: center !important;
  }

  .d-flex {
    display: flex !important;
  }

  .w-50 {
    width: 50% !important;
  }

  .align-items-center {
    align-items: center !important;
  }

  .text-center {
    text-align: center !important;
  }
`;

export const commonStyle = css`
  * {
    color: var(--text-color);
  }

  .btn {
    display: inline-block;
    font-weight: 400;
    color: var(--primary-color);
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    background-color: transparent;
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
  }

  .btn-icon {
    cursor: pointer;
    padding: 0.375rem 0.75rem;
    background-color: transparent;
    border: none;
  }

  .shadow-sm {
    box-shadow: var(--box-shadow);
  }

  .card {
    width: 92%;
    margin: auto;
    border-radius: 0.25rem;
    background-color: var(--card-background);
  }

  .card-title {
    padding: 6% 0 0 6%;
    color: var(--text-color);
  }
`;
