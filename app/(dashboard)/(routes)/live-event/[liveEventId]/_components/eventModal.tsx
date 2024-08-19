"use client";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import questionMark from "../../../../../../assets/icons/questionMarkImg.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

const EventModal = ({
  endDateTime,
  liveEventId,
  getLiveEvent,
  isEnded,
}: {
  endDateTime: any;
  liveEventId: string;
  getLiveEvent: any;
  isEnded: boolean;
}) => {
  const user = useSelector((state: any) => state?.user);
  const isAdmin = user?.role === "ADMIN";
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState<any>(null);

  useEffect(() => {
    if (isEnded) return;
    const interval = setInterval(() => {
      const currentTime = moment();
      const endTime = moment(endDateTime);
      const endPass15min = moment(endTime).add(5, "minutes");

      if (currentTime.isAfter(endTime) && currentTime.isBefore(endPass15min)) {
        setIsOpen(true);
        setRemainingTime(endPass15min.diff(currentTime, "seconds"));
      } else if (currentTime.isAfter(endPass15min)) {
        setIsOpen(false);
        setRemainingTime(null);
      } else {
        setIsOpen(false);
        setRemainingTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDateTime]);

  useEffect(() => {
    if (remainingTime !== null && remainingTime <= 0) {
      setIsOpen(false);
    }
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes} : ${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  if (!isAdmin) return;

  return (
    <div>
      <Modal isOpen={modalIsOpen && !isEnded} style={customStyles}>
        <div className="flex flex-col items-center">
          <div className="w-[15%]">
            <Image className="" alt="questionMark" src={questionMark} />
          </div>
          <p className="my-[3%] text-black">Do you want to end this session?</p>
          {remainingTime && (
            <p className="my-[3%] mt-0 text-[32px] font-black text-black">
              {formatTime(remainingTime)}
            </p>
          )}
          <div className="flex w-[50%] items-center justify-around">
            <Button
              onClick={async () => {
                try {
                  const response = await axios.patch(
                    `/api/liveEvent/${liveEventId}`,
                    {
                      endDateTime: moment(new Date())
                        ?.add(15, "minutes")
                        ?.toISOString(),
                    }
                  );
                  if (response?.status === 200) {
                    getLiveEvent();
                    toast?.success("Event updated");
                    router?.refresh();
                  }
                } catch {
                  toast.error("Something went wrong");
                }
              }}
              disabled={!(() => {})}
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 md:w-auto"
            >
              No
            </Button>
            <Button
              onClick={async () => {
                try {
                  const response = await axios.patch(
                    `/api/liveEvent/${liveEventId}`,
                    {
                      isEnded: true,
                    }
                  );
                  if (response?.status === 200) {
                    getLiveEvent();
                    toast?.success("Event updated");
                    router?.refresh();
                    // setIsOpen(false);
                  }
                } catch {
                  toast.error("Something went wrong");
                }
              }}
              disabled={!(() => {})}
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 md:w-auto"
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventModal;
