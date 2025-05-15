import Done from "./wait-served";
import Has from "./has-served";
import Waiting from "./waiting";
import PaymentPending from "./payment";
import { useRouter } from "next/router";

export default function KdsContent() {
  const router = useRouter();
  const queryParams = {
    isBringServe: router.query["bring-serve"] !== undefined,
    isPendingPayment: router.query["pending-payment"] !== undefined,
    isBarId: router.query["barId"] !== undefined,
    isBar: router.query["bar"] !== undefined,
  };

  return (
    <div className="bg-[#FF5C00] lg:overflow-x-hidden sm:overflow-x-auto">
      <div className="flex gap-4 md:overflow-x-hidden w-full scrollbar-hide">
        {/* Chờ thanh toán */}

        {!queryParams.isBringServe && (
          <div className={`flex-${queryParams?.isBarId ? "2" : "1"}`}>
            <PaymentPending queryParams={queryParams} />
          </div>
        )}

        {/* Chờ chế biến */}
        <div className={`flex-${queryParams?.isBringServe ? "2" : "1"}`}>
          <Waiting queryParams={queryParams} />
        </div>

        {/* Chế biến xong/chờ phục vụ */}
        {!queryParams.isPendingPayment && (
          <div className={`flex-${queryParams?.isBringServe ? "1" : "2"}`}>
            <Done queryParams={queryParams} />
          </div>
        )}

        {/* Đã phục vụ */}
        {queryParams.isBringServe && (
          <div className={`flex-${queryParams?.isBringServe ? "2" : "1"}`}>
            <Has queryParams={queryParams} />
          </div>
        )}
      </div>
    </div>
  );
}
