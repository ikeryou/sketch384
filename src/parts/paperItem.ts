import { Color, Vector3 } from "three";
import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Rect } from "../libs/rect";
import { Util } from "../libs/util";
import { MousePointer } from "../core/mousePointer";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class PaperItem extends MyDisplay {

  private _num: number
  private _id: number
  private _inner: HTMLElement
  private _text: HTMLElement
  private _color: Color

  public size: Rect = new Rect()
  public itemSize: Rect = new Rect()
  public pos: Vector3 = new Vector3()
  public rot: Vector3 = new Vector3()

  constructor(opt:any) {
    super(opt)

    this._c = opt.parentId * 0

    this._color = opt.color
    this._num = opt.num
    this._id = opt.id

    this._inner = document.createElement('div')
    this._inner.classList.add('js-paperItem__inner')
    this.el.append(this._inner)

    this._text = document.createElement('div')
    this._text.classList.add('js-paperItem__inner__text')
    this._inner.append(this._text)

    this.addClass('s-gpu')
    this._inner.classList.add('s-gpu')
    // this._text.classList.add('s-gpu')

    this._text.innerHTML = opt.text
  }

  protected _update(): void {
    super._update()

    if(this._c % 3 == 0) {
      this.size.width = this.getWidth(this._text)
      this.size.height = this.getHeight(this._text)
    }

    // const colA = new Color(0x000000)
    const colA2 = this._color.clone()
    let colB = new Color(0xffffff)
    if(this._id % 2 == 0) {
      colB = new Color(0x0000ff)
    }

    const size = this.size.width / this._num
    this.itemSize.width = size

    // const mx = MousePointer.instance.easeNormal.x
    const my = MousePointer.instance.easeNormal.y
    this.rot.y = Math.sin(Util.radian(this._id * 20 + this._c * 5)) * Util.map(my, 0, Func.instance.val(90, 90), -1, 1)

    Tween.instance.set(this.el, {
      width: size,
      height: this.size.height,
      x: this.pos.x,
      y: this.pos.y,
      z: this.pos.z,
      rotationY: this.rot.y,
      backgroundColor: colA2.lerp(colB, Util.map(Math.abs(this.rot.y) - 20, 0, 1, 0, 2)).getStyle()
    })

    Tween.instance.set(this._inner, {
      width: size,
      height: this.size.height,
    })

    const txtCol = colA2.lerp(colB, Util.map(Math.abs(this.rot.y) - 20, 0, 1, 0, 2)).clone()
    txtCol.r = 1 - txtCol.r
    txtCol.g = 1 - txtCol.g
    txtCol.b = 1 - txtCol.b
    Tween.instance.set(this._text, {
      x: size * this._id * -1,
      color: txtCol.getStyle()
    })
  }

  protected  _resize(): void {
    super._resize()
  }
}