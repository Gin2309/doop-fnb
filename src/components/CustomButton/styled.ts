import styled from "styled-components";

export const ButtonStyled = styled.div`
  .ant-btn {
    height: 44px;
    width: 100%;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    font-weight: 500;
    box-shadow: none !important;
    transition: opacity 0.3s ease;

    span {
      font-weight: 500;
      font-size: inherit;
    }
  }

  .no-text {
    span {
      display: none;
    }
  }

  .no-text .mr-2 {
    margin-right: 0;
  }

  .danger {
    background: rgba(253, 40, 40, 1);

    &:hover {
      background: #d64457 !important;
      opacity: 0.8;
    }
  }

  .gray {
    background: #f2f2f2;
    color: black;

    span {
      font-size: 12px;
    }

    &:hover {
      background: #f2f2f2 !important;
      opacity: 0.8;
      color: black !important;
    }
  }

  .none {
    background: transparent !important;
    &:hover {
      background: transparent !important;
      color: #f38b25 !important;
    }
  }

  .danger.btn-outline {
    span {
      font-size: inherit;
      color: #d64457;
    }

    background: unset !important;
    color: #d64457;
    border: 1px solid #d64457;
  }

  .success {
    background: #00b63e;

    &:hover {
      opacity: 0.8;
    }
  }
  .success.btn-outline {
    span {
      font-size: inherit;
      color: #00b63e;
    }

    background: unset !important;
    color: #00b63e;
    border: 1px solid #00b63e;
  }

  .primary {
    background: linear-gradient(90deg, #f38820 0%, #ff5c00 100%);

    &:hover {
      background: #f38820 !important;
      opacity: 0.8;
    }
  }
  .primary.btn-outline {
    span {
      font-size: inherit;
      color: #0070f4;
    }

    background: unset !important;
    color: #0070f4;
    border: 1px solid #0070f4;
  }

  .disable {
    background: #6d6d6d;

    &:hover {
      background: #6d6d6d !important;
      opacity: 0.8;
    }
  }
  .disable.btn-outline {
    span {
      font-size: inherit;
      color: #6d6d6d;
    }

    background: unset !important;
    color: #6d6d6d;
    border: 1px solid #6d6d6d;
  }

  .original {
    background: white;
    border: 1px solid #d7dfe9;
    span {
      font-size: inherit;
      color: #455468;
    }

    &:hover {
      background: white !important;
      border: 1px solid #ff5c00 !important;
      opacity: 0.8;
      span {
        font-size: inherit;
        color: #ff5c00 !important;
      }
    }
  }

  .download-btn {
    background: white;
    border: 1px solid #009933;
    border-radius: 8px;
    height: 40px;
    padding: 8px 12px;
    span {
      font-size: inherit;
      color: #009933;
    }

    &:hover {
      background: white !important;
      border: 1px solid #009933 !important;
      opacity: 0.8;
      span {
        font-size: inherit;
        color: #009933 !important;
      }
    }
  }

  .vat-btn {
    background: white;
    border: 1px solid #3355ff;
    border-radius: 8px;
    height: 40px;
    padding: 8px 12px;
    span {
      font-size: inherit;
      color: #3355ff;
    }

    &:hover {
      background: white !important;
      border: 1px solid #3355ff !important;
      opacity: 0.8;
      span {
        font-size: inherit;
        color: #3355ff !important;
      }
    }
  }

  .print-btn {
    background: white;
    border: 1px solid #ff5c00 !important;
    padding: 8px 12px;
    height: 40px;
    border-radius: 8px;
    span {
      font-size: inherit;
      color: #ff5c00;
    }

    &:hover {
      background: white !important;
      border: 1px solid #ff5c00 !important;
      opacity: 0.8;
      span {
        font-size: inherit;
        color: #ff5c00 !important;
      }
    }
  }

  .green-btn {
    background: linear-gradient(90deg, #0bb544 0%, #00a035 100%);
    &:hover {
      background: linear-gradient(90deg, #0bb544 0%, #00a035 100%) !important;
      opacity: 0.8;
    }
  }
  .green-btn.btn-outline {
    span {
      font-size: inherit;
      color: #0070f4;
    }

    background: unset !important;
    color: #0070f4;
    border: 1px solid #0070f4;
  }

  .verified {
    background: #009933;
    &:hover {
      background: #009933 !important;
      opacity: 0.8;
    }
  }
  .verified.btn-outline {
    span {
      font-size: inherit;
      color: #fff;
    }

    background: unset !important;
    color: #fff;
    border: none !important;
  }

  .pending {
    background: #fdd33e;
    color: #1a1a1a;
    &:hover {
      background: #fdd33e !important;
      opacity: 0.8;
    }
  }

  .pending.btn-outline {
    span {
      font-size: inherit;
      color: #1a1a1a;
    }

    background: unset !important;
    color: #1a1a1a;
    border: none !important;
  }

  .new {
    background: #d6ddff;
    color: #3355ff;
    &:hover {
      background: #d6ddff !important;
      opacity: 0.8;
    }
  }
  .new.btn-outline {
    span {
      font-size: inherit;
      color: #3355ff;
    }

    background: unset !important;
    color: #3355ff;
    border: none !important;
  }

  .disabled {
    background: #e50000;
    &:hover {
      background: #e50000 !important;
      opacity: 0.8;
    }
  }
  .disabled.btn-outline {
    span {
      font-size: inherit;
      color: #ffffff;
    }

    background: unset !important;
    color: #e50000;
    border: none !important;
  }

  .blue-btn {
    background: #0085ff;
    &:hover {
      background: #f2f5ff !important;
      opacity: 0.8;
    }
  }
  .blue-btn span {
    font-size: inherit;
    color: white;
  }

  .blue-text {
    color: #0085ff;
    &:hover {
      color: #0085ff !important;
      background: none !important;
    }
  }

  .border-color {
    background: white;
    border: 1px solid #ff5c00;
    span {
      font-size: inherit;
      color: #ff5c00 !important;
    }

    &:hover {
      background: white !important;
      border: 1px solid #f38820 !important;
      opacity: 0.8;
      span {
        font-size: inherit;
        color: #f38820 !important;
      }
    }
  }

  .icon {
    padding: 4px;
    background: white;
    border: 1px solid #d7dfe9;
    border-radius: 10px;
    span {
      margin-left: 8px;
      font-size: inherit;
      color: #ff5c00;
    }

    &:hover {
      background: white !important;
      opacity: 0.8;
    }
  }

  .search {
    background: white;
    border: 1px solid #d7dfe9;
    border-radius: 4px;
    span {
      font-size: inherit;
      color: #455468;
    }

    &:hover {
      background: white !important;
      opacity: 0.8;
    }
  }

  .round-no-border {
    background: white;
    border: 1px solid #d7dfe9;
    border-radius: 50px;
    span {
      font-size: inherit;
      color: #455468;
    }

    &:hover {
      background: white !important;
      opacity: 0.8;
    }
  }

  .link {
    height: 30px;
    background: transparent;
    border: 1px solid red;
    span {
      font-size: inherit;
      color: red;
      font-weight: 400;
    }

    &:hover {
      background: white !important;
      opacity: 0.8;
    }
  }

  .outline {
    background: transparent !important;
    border: none !important;

    span {
      font-size: inherit;
      color: rgba(255, 92, 0, 1);
    }
  }

  .export {
    background: transparent !important;
    border: none !important;

    span {
      font-size: inherit;
      color: rgba(51, 85, 255, 1);
    }
  }

  .submit {
    border-radius: 0 !important;
    height: 100% !important;
    border: 1px solid #dbd3d3;
    border-left: none !important;
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
    &:hover {
      background: white !important;
      opacity: 0.8;
    }

    span {
      color: #666 !important;
      font-weight: 300;
    }
  }

  .export {
    background: transparent !important;
    border: 1px solid #107c41 !important;
    border-radius: 4px;
    span {
      font-size: inherit;
      color: #107c41;
      font-weight: 600;
    }

    &:hover {
      background: #fff !important;
      opacity: 0.8;
    }
  }

  .view {
    background: linear-gradient(90deg, #f38820 0%, #ff5c00 100%);
    border-radius: 4px;

    &:hover {
      background: #f38820 !important;
      opacity: 0.8;
    }
  }
  .view.btn-outline {
    span {
      font-size: inherit;
      color: #0070f4;
    }

    background: unset !important;
    color: #0070f4;
    border: 1px solid #0070f4;
  }

  .basic {
    background: #fff !important;
    border: 1px solid #e5e5e5 !important;
    border-radius: 8px;
    width: auto;
    span {
      font-size: inherit;
      color: #333333;
      font-weight: 400;
    }

    &:hover {
      background: #fff !important;
      opacity: 0.8;
    }
  }
`;
