import Image from "@tiptap/extension-image";

export const ImageResize = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      style: {
        default: "width: 100%; height: auto; cursor: pointer;",
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setImageAlign:
        (alignment: string) =>
        ({ tr, state, dispatch }: any) => {
          const { selection } = state;
          const node = selection.node;

          if (node.type.name === "image") {
            // Remove existing display and justify-content styles
            let newStyle = node.attrs.style
              .replace(/display: flex;?\s*/g, "")
              .replace(
                /justify-content: (flex-start|center|flex-end);?\s*/g,
                ""
              );

            // Add the new alignment style
            if (alignment === "left") {
              newStyle += "display: flex; justify-content: flex-start;";
            } else if (alignment === "center") {
              newStyle += "display: flex; justify-content: center;";
            } else if (alignment === "right") {
              newStyle += "display: flex; justify-content: flex-end;";
            }

            const newAttrs = {
              ...node.attrs,
              style: newStyle,
            };

            const transaction = tr.setNodeMarkup(
              selection.from,
              undefined,
              newAttrs
            );
            dispatch(transaction);

            return true;
          }

          return false;
        },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const {
        view,
        options: { editable },
      } = editor;
      const { src, alt, style } = node.attrs;
      const $positionContainer = document.createElement("div");
      const $container = document.createElement("div");
      const $img = document.createElement("img");
      const iconStyle = "width: 24px; height: 24px; cursor: pointer;";

      const dispatchNodeView = () => {
        if (typeof getPos === "function") {
          const newAttrs = {
            ...node.attrs,
            style: `${$img.style.cssText}`,
          };
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
        }
      };
      const paintPositionContoller = () => {
        const $postionController = document.createElement("div");

        const $leftController = document.createElement("img");
        const $centerController = document.createElement("img");
        const $rightController = document.createElement("img");

        $postionController.setAttribute(
          "style",
          "position: absolute; top: 0%; left: 50%; width: 100px; height: 25px; z-index: 999; background-color: rgba(255, 255, 255, 0.7); border-radius: 4px; border: 2px solid #6C6C6C; cursor: pointer; transform: translate(-50%, -50%); display: flex; justify-content: space-between; align-items: center; padding: 0 10px;"
        );
        $leftController.setAttribute(
          "src",
          "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg"
        );
        $leftController.setAttribute("style", iconStyle);
        $centerController.setAttribute(
          "src",
          "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg"
        );
        $centerController.setAttribute("style", iconStyle);
        $rightController.setAttribute(
          "src",
          "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg"
        );
        $rightController.setAttribute("style", iconStyle);

        $leftController.addEventListener("click", () => {
          $positionContainer.setAttribute(
            "style",
            "display: flex; justify-content: flex-start;"
          );
          $img.setAttribute(
            "style",
            `${$img.style.cssText} justify-content: flex-start;`
          );
          dispatchNodeView();
        });
        $centerController.addEventListener("click", () => {
          $positionContainer.setAttribute(
            "style",
            "display: flex; justify-content: center;"
          );
          $img.setAttribute(
            "style",
            `${$img.style.cssText} justify-content: center;`
          );
          dispatchNodeView();
        });
        $rightController.addEventListener("click", () => {
          $positionContainer.setAttribute(
            "style",
            "display: flex; justify-content: flex-end;"
          );
          $img.setAttribute(
            "style",
            `${$img.style.cssText} justify-content: flex-end;`
          );
          dispatchNodeView();
        });

        $postionController.appendChild($leftController);
        $postionController.appendChild($centerController);
        $postionController.appendChild($rightController);

        $container.appendChild($postionController);
      };

      // add position style and className
      $positionContainer.appendChild($container);
      const justifyContent = style.match(/justify-content: (.*?);/);
      $positionContainer.setAttribute(
        "style",
        `display: flex; ${justifyContent ? justifyContent[0] : ""}`
      );

      if (justifyContent) {
        $img.className = `tiptap-image-${justifyContent[1]}`;
      }

      $container.setAttribute("style", `${style}`);
      $container.appendChild($img);

      $img.setAttribute("src", src);
      $img.setAttribute("alt", alt);
      $img.setAttribute("style", style);
      $img.setAttribute("draggable", "true");

      if (!editable) return { dom: $img };

      const dotsPosition = [
        "top: -4px; left: -4px; cursor: nwse-resize;",
        "top: -4px; right: -4px; cursor: nesw-resize;",
        "bottom: -4px; left: -4px; cursor: nesw-resize;",
        "bottom: -4px; right: -4px; cursor: nwse-resize;",
      ];

      let isResizing = false;
      let startX: number, startWidth: number, startHeight: number;

      $container.addEventListener("click", () => {
        //remove remaining dots and position controller
        if ($container.childElementCount > 3) {
          for (let i = 0; i < 5; i++) {
            $container.removeChild($container.lastChild as Node);
          }
        }

        paintPositionContoller();

        $container.setAttribute(
          "style",
          `position: relative; border: 1px dashed #6C6C6C; ${style} cursor: pointer;`
        );

        Array.from({ length: 4 }, (_, index) => {
          const $dot = document.createElement("div");
          $dot.setAttribute(
            "style",
            `position: absolute; width: 9px; height: 9px; border: 1.5px solid #6C6C6C; border-radius: 50%; ${dotsPosition[index]}`
          );

          $dot.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startWidth = $container.offsetWidth;
            startHeight = $container.offsetHeight;

            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return;
              const deltaX =
                index % 2 === 0 ? -(e.clientX - startX) : e.clientX - startX;

              const aspectRatio = startWidth / startHeight;
              const newWidth = startWidth + deltaX;
              const newHeight = newWidth / aspectRatio;

              $container.style.width = newWidth + "px";
              $container.style.height = newHeight + "px";

              $img.style.width = newWidth + "px";
              $img.style.height = newHeight + "px";
            };

            const onMouseUp = () => {
              if (isResizing) {
                isResizing = false;
              }
              dispatchNodeView();

              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          });
          $container.appendChild($dot);
        });
      });

      document.addEventListener("click", (e: MouseEvent) => {
        const $target = e.target as HTMLElement;
        const isClickInside =
          $container.contains($target) || $target.style.cssText === iconStyle;

        if (!isClickInside) {
          const containerStyle = $container.getAttribute("style");
          const newStyle = containerStyle?.replace(
            "border: 1px dashed #6C6C6C;",
            ""
          );
          $container.setAttribute("style", newStyle as string);

          if ($container.childElementCount > 3) {
            for (let i = 0; i < 5; i++) {
              $container.removeChild($container.lastChild as Node);
            }
          }
        }
      });

      return {
        dom: $positionContainer,
      };
    };
  },
});
