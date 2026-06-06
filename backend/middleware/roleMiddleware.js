const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

function defineAbilityFor(user) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === 'admin') {
        can('manage', 'all'); // Admin can do everything
    } else if (user.role === 'cleaner') {
        can('read', 'Request');
        can('update', 'Request');
        can('read', 'User', { _id: user._id }); // Can read own profile
    } else if (user.role === 'user') {
        can('create', 'Request');
        can('read', 'Request', { userId: user._id });
        can('read', 'Payment', { userId: user._id });
        can('read', 'User', { _id: user._id });
    } else {
        can('read', 'User'); // Guest
    }

    return build();
}

const checkRoleAndAbility = (action, subject) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const ability = defineAbilityFor(req.user);
        
        // Subject could be a string like 'Request' or an object
        // For ABAC on an object, the controller will do further checks, but middleware checks class-level primarily
        if (ability.can(action, subject)) {
            req.ability = ability; // attach for further evaluation
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
    };
};

module.exports = { checkRoleAndAbility, defineAbilityFor };
