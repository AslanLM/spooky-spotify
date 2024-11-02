import { useRef } from "react";
import Spline from "@splinetool/react-spline";

const Model3D = () => {
    const spline = useRef();
    const objectToAnimate = useRef();

    function onLoad(splineApp) {
        spline.current = splineApp; // Guarda la referencia del spline
        const obj = spline.current.findObjectByName('Group'); // Asegúrate de que el nombre es correcto
        objectToAnimate.current = obj; // Guarda el objeto para uso posterior
    }

    function triggerAnimation() {
        if (objectToAnimate.current) {
            spline.current.emitEvent('mousePress', objectToAnimate.current.id); // Usa el ID del objeto
        } else {
            console.error('El objeto no está disponible.');
        }
    }

  return (
    <div className="absolute top-[-12rem] right-10 h-[30rem] w-auto z-10">
      <Spline
        scene="https://prod.spline.design/t4Ock6G6P2awH8Wz/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
};

export default Model3D;
