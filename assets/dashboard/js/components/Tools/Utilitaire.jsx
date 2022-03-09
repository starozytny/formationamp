import React, { useState } from 'react';

export function UtPhones({ elem, phone1 = "", phone2 = "", phone3 = "" }) {
    const [open, setOpen] = useState(false);

    let ph1 = elem && elem.phone1 ? elem.phone1 : phone1;
    let ph2 = elem && elem.phone2 ? elem.phone2 : phone2;
    let ph3 = elem && elem.phone3 ? elem.phone3 : phone3;

    return <>
        <div className={"ut-phones" + (open ? " active" : "")}>
            <div className="sub phone-main">
                <span>{ph1}</span>
                {ph2 !== "" && ph3 !== "" && <div className="btn-phone-details" onClick={() => setOpen(!open)}>
                    <span className={"icon-" + (open ? "minus" : "add")} />
                    <span>Voir {open ? "moins" : "plus"}</span>
                </div>}
            </div>
            <div className="sub phone-details">{ph2}</div>
            <div className="sub phone-details">{ph3}</div>
        </div>

    </>
}