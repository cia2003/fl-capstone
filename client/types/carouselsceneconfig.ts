
import { Group } from "three"

export type CarouselSceneConfig = {
  images: string[];
  radius: number;
  imageWidth: number;
  imageHeight: number;
  cornerRadius: number;
  bendAmount: number;
  centerOpacity: number;
  adjacentOpacity: number;
  farOpacity: number;
  friction: number;
  wheelSensitivity: number;
  dragSensitivity: number;
  enableSnapping: boolean;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  onImageClick: (index: number) => void;
};

export type CarouselMotionRefs = {
  rotationRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  isDragging: React.MutableRefObject<boolean>;
  isVerticalDrag: React.MutableRefObject<boolean>;
  currentIndexRef: React.MutableRefObject<number>;
  publishedIndexRef: React.MutableRefObject<number>;
  snapTargetIndexRef: React.MutableRefObject<number>;
  targetRotationRef: React.MutableRefObject<number>;
  isSnapping: React.MutableRefObject<boolean>;
  isSnapSuppressed: React.MutableRefObject<boolean>;
};

export type CarouselInteractionProps =
  CarouselMotionRefs & {
    images: string[];
    wheelSensitivity: number;
    dragSensitivity: number;

    activePointerId: React.RefObject<number | null>;
    dragStartX: React.RefObject<number>;
    dragStartY: React.RefObject<number>;
    lastMouseX: React.RefObject<number>;

    gl: {
      domElement: HTMLCanvasElement;
    };

    snapToIndex: (index: number) => void;
    onImageClick?: (index: number) => void;
  };

export type CarouselAnimationProps =
  CarouselMotionRefs & {
    groupRef: React.RefObject<Group | null>;
    images: string[];
    friction: number;
    enableSnapping: boolean;
    delta: number;
    snapToIndex: (index: number) => void;
    onIndexChange: (index: number) => void;
  };