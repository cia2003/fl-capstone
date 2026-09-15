type CatAnimationProps = {
  size?: "sm" | "md" | "lg"
}

export function CatAnimation({ size = "md" }: CatAnimationProps) {
  return (
    <div
      className={`cat-animation cat-animation--${size}`}
      aria-hidden="true"
    >
      <div className="cat">
        <div className="cat__body">
          <div className="cat__head">
            <div className="cat__ear cat__ear--left" />
            <div className="cat__ear cat__ear--right" />

            <div className="cat__face">
              <div className="cat__eye cat__eye--left">
                <div className="cat__pupil" />
              </div>

              <div className="cat__eye cat__eye--right">
                <div className="cat__pupil" />
              </div>

              <div className="cat__muzzle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}