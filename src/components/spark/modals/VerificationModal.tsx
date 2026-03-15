import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
}

const steps = [
  { icon: "Camera", title: "Сделай селфи", desc: "Мы сравним фото с аватаром для подтверждения личности" },
  { icon: "BadgeCheck", title: "Проверка", desc: "Модерация занимает до 24 часов" },
  { icon: "Sparkles", title: "Готово!", desc: "Значок верификации появится на профиле" },
];

export default function VerificationModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="ShieldCheck" size={20} className="text-blue-400" />
            <h2 className="text-white font-bold text-lg">Верификация профиля</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        <div className="p-5">
          {!submitted ? (
            <>
              {/* Steps */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i <= step ? "btn-gradient text-white" : "bg-white/10 text-white/30"}`}>
                      {i < step ? <Icon name="Check" size={12} /> : i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-[2px] flex-1 rounded-full transition-all ${i < step ? "btn-gradient opacity-60" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Current step */}
              <div className="glass rounded-2xl p-6 text-center mb-5">
                <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={steps[step].icon as never} size={28} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{steps[step].title}</h3>
                <p className="text-white/50 text-sm">{steps[step].desc}</p>
              </div>

              {step === 0 && (
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center mb-5 hover:border-pink-500/40 transition-all cursor-pointer">
                  <Icon name="Camera" size={32} className="text-white/30 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">Нажми, чтобы сделать фото</p>
                </div>
              )}

              <button
                onClick={() => {
                  if (step < steps.length - 1) setStep(s => s + 1);
                  else setSubmitted(true);
                }}
                className="w-full btn-gradient text-white font-bold py-3.5 rounded-2xl">
                {step < steps.length - 1 ? "Далее" : "Отправить на проверку"}
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <Icon name="BadgeCheck" size={40} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Заявка отправлена!</h3>
              <p className="text-white/50 text-sm mb-6">Мы проверим профиль в течение 24 часов и уведомим тебя</p>
              <button onClick={onClose} className="btn-gradient text-white font-semibold px-8 py-3 rounded-2xl">
                Отлично!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
