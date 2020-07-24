import React from 'react'
import classes from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Meat', type: 'meat' },
]

const buildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p>
                current prices: <strong>{props.price.toFixed(2)}</strong>
            </p>
            {controls.map((ctl) => (
                <BuildControl
                    key={ctl.label}
                    label={ctl.label}
                    added={() => props.ingredientAdded(ctl.type)}
                    removed={() => props.ingredientRemoved(ctl.type)}
                    disabled={props.disabled[ctl.type]}
                />
            ))}
            <button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.ordered}>
                {props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER'}
            </button>
        </div>
    )
}

export default buildControls
